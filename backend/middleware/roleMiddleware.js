// Simple Role-Based Access Control Middleware
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role']; // Simple simulation for demonstration

    if (!userRole) {
      return res.status(401).json({ message: 'Unauthorized: No role provided' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = { authorize };
