const jwt = require('jsonwebtoken');

// Middleware function for role-based authentication
const authMiddleware = (roles) => (req, res, next) => {
    // Retrieve token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token is provided, deny access
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    try {
        // Verify the token using the secret stored in an environment variable
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the secret key from environment variables

        // Attach user info to the request object (this will be available in route handlers)
        req.user = decoded;

        // Check if the user's role matches any of the allowed roles
        if (!roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Access Denied. Insufficient permissions.' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If the token is invalid or expired
        return res.status(400).json({ message: 'Invalid Token or Token Expired' });
    }
};

module.exports = authMiddleware;
