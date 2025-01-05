const jwt = require('jsonwebtoken');

const JWT_SECRET = 'a7c4c2cb4792a25b2297406f32d4546cb8a4d728faa473f98b0be2e38ae2d12f';

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

// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || '4abf5ebfa12ee3c6e7091c168f8357866b7ee8ebecfc7f000b3a41d93dd96b0d';

// exports.authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const verified = jwt.verify(token, JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid or expired token.' });
//     }
// };

exports.authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};
