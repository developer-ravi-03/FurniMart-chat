const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatt');
const auth = require('./middleware/auth');
const User = require('./model/user');
const Message = require('./model/message');


// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", // Change to your frontend URL in production
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extend:true}));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);


// Socket.IO middleware for authentication
io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = auth.verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });

  // Socket.IO connection
io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user.id})`);
    
    // Join user to their own room (for private messages)
    socket.join(socket.user.id.toString());
    
    // If user is a customer support, join the support room
    if (socket.user.role === 'support') {
      socket.join('support');
      
      // Notify other support staff that a new support user connected
      socket.to('support').emit('support:connected', {
        supportId: socket.user.id,
        name: socket.user.name
      });
    }
    // Join to general chat
  socket.join('general');
  
  // Handle new chat message
  socket.on('message:send', async (data) => {
    try {
      const { content, to, chatId } = data;
      
      // Create new message
      const message = new Message({
        sender: socket.user.id,
        content,
        chatId,
        receiver: to
      });
      
      await message.save();
      // Emit to receiver
      io.to(to).emit('message:received', {
        message: {
          _id: message._id,
          content: message.content,
          sender: {
            _id: socket.user.id,
            name: socket.user.name
          },
          chatId: message.chatId,
          createdAt: message.createdAt
        }
      });
       // Also emit to all support staff if this is a customer message
       if (socket.user.role === 'customer') {
        socket.to('support').emit('message:support-needed', {
          message: {
            _id: message._id,
            content: message.content,
            sender: {
              _id: socket.user.id,
              name: socket.user.name
            },
            chatId: message.chatId,
            createdAt: message.createdAt
          }
        });
      }
    } catch (error) {
      console.error('Message sending error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  // Handle user typing
  socket.on('typing', (data) => {
    const { chatId, to } = data;
    socket.to(to).emit('typing', {
      chatId,
      userId: socket.user.id,
      name: socket.user.name
    });
  });
  
  // Handle user stopped typing
  socket.on('stop-typing', (data) => {
    const { chatId, to } = data;
    socket.to(to).emit('stop-typing', {
      chatId,
      userId: socket.user.id
    });
  });
  // Handle support staff taking a chat
  socket.on('support:take-chat', async (data) => {
    try {
      const { chatId, customerId } = data;
      
      // Update chat with support staff
      await Message.updateMany(
        { chatId },
        { $set: { assignedTo: socket.user.id } }
      );
      
      // Notify customer that support has joined
      io.to(customerId).emit('support:joined', {
        chatId,
        support: {
          id: socket.user.id,
          name: socket.user.name
        }
      });
      // Notify other support staff
      socket.to('support').emit('support:chat-taken', {
        chatId,
        customerId,
        supportId: socket.user.id,
        supportName: socket.user.name
      });
    } catch (error) {
      console.error('Error assigning support:', error);
      socket.emit('error', { message: 'Failed to assign support staff' });
    }
  });
  
  // Handle marking conversation as resolved
  socket.on('chat:resolve', async (data) => {
    try {
      const { chatId, customerId } = data;
      
      // Update chat status to resolved
      await Message.updateMany(
        { chatId },
        { $set: { status: 'resolved' } }
      );
      // Notify customer that chat has been resolved
      io.to(customerId).emit('chat:resolved', {
        chatId,
        resolvedBy: {
          id: socket.user.id,
          name: socket.user.name
        }
      });
      
      // Notify all support staff
      io.to('support').emit('chat:resolved', {
        chatId,
        customerId,
        resolvedBy: {
          id: socket.user.id,
          name: socket.user.name
        }
      });
    } catch (error) {
      console.error('Error resolving chat:', error);
      socket.emit('error', { message: 'Failed to resolve chat' });
    }
  });
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.name} (${socket.user.id})`);
    
    if (socket.user.role === 'support') {
      socket.to('support').emit('support:disconnected', {
        supportId: socket.user.id,
        name: socket.user.name
      });
    }
  });
});

// Start server
const PORT=process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


