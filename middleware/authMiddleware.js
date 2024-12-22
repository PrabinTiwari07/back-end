const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with your secret key

// Middleware to authenticate token
exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};
