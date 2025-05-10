// ========== middleware/auth.js ==========
const jwt = require("jsonwebtoken");

const JWT_SECRET = "jksdfklsfkllglijrgeol;"; // Change to a secure string in production and use env variables

module.exports = {
  // Middleware to verify token
  authenticate: (req, res, next) => {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if no token
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      // Add user from payload
      req.user = decoded.userId;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  },

  // Function to generate token
  generateToken: (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
  },

  // Function to verify token (for socket.io)
  verifyToken: (token) => {
    return jwt.verify(token, JWT_SECRET);
  },
};
