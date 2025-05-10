// ========== routes/chat.js ==========
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../model/message');
const User = require('../model/user');

// @route   GET api/chat/messages/:chatId
// @desc    Get all messages for a chat
// @access  Private
router.get('/messages/:chatId', auth.authenticate, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email')
      .populate('assignedTo', 'name email');
    
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/chat/create
// @desc    Create a new chat session
// @access  Private
router.post('/create', auth.authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.user);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      // Generate a unique chat ID
      const chatId = `chat_${Date.now()}_${user._id.toString().substr(0, 6)}`;
      
      // Create initial system message
      const message = new Message({
        chatId,
        sender: user._id,
        content: 'Chat session started',
        receiver: 'support' // Initially to all support staff
      });
      
      await message.save();

      res.json({
        chatId,
        message
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

  // @route   GET api/chat/active
// @desc    Get all active chats for support staff
// @access  Private (Support & Admin only)
router.get('/active', auth.authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    
    if (!user || (user.role !== 'support' && user.role !== 'admin')) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    // Find all unique chat IDs that are not resolved
    const chats = await Message.aggregate([
      { $match: { status: { $ne: 'resolved' } } },
      { $group: { _id: '$chatId' } },
      { $sort: { _id: -1 } }
    ]);
    // Get the last message and user info for each chat
    const activeChats = await Promise.all(
        chats.map(async (chat) => {
          const lastMessage = await Message.findOne({ chatId: chat._id })
            .sort({ createdAt: -1 })
            .populate('sender', 'name email')
            .populate('assignedTo', 'name email');
          
          // Get customer info
          const firstMessage = await Message.findOne({ chatId: chat._id })
            .sort({ createdAt: 1 });
          
          const customer = await User.findById(firstMessage.sender)
            .select('name email');
          
          return {
            chatId: chat._id,
            lastMessage,
            customer,
            assignedTo: lastMessage.assignedTo,
            createdAt: firstMessage.createdAt
          };
        })
      );
      
      res.json(activeChats);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  // @route   GET api/chat/history
  // @desc    Get chat history for a user
  // @access  Private
  router.get('/history', auth.authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.user);
      
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
       // Find all unique chat IDs for this user
    let chats;
    
    if (user.role === 'customer') {
      // For customers, find chats they initiated
      chats = await Message.aggregate([
        { $match: { sender: user._id } },
        { $group: { _id: '$chatId' } },
        { $sort: { _id: -1 } }
      ]);
    } else {
      // For support/admin, find chats they were assigned to
      chats = await Message.aggregate([
        { $match: { assignedTo: user._id } },
        { $group: { _id: '$chatId' } },
        { $sort: { _id: -1 } }
      ]);
    }
    // Get the last message for each chat
    const chatHistory = await Promise.all(
        chats.map(async (chat) => {
          const lastMessage = await Message.findOne({ chatId: chat._id })
            .sort({ createdAt: -1 })
            .populate('sender', 'name email')
            .populate('assignedTo', 'name email');
          
          const firstMessage = await Message.findOne({ chatId: chat._id })
            .sort({ createdAt: 1 });
          
          return {
            chatId: chat._id,
            lastMessage,
            status: lastMessage.status,
            createdAt: firstMessage.createdAt,
            updatedAt: lastMessage.createdAt
          };
        })
      );
      res.json(chatHistory);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  module.exports = router;
  