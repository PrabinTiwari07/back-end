const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "a7c4c2cb4792a25b2297406f32d4546cb8a4d728faa473f98b0be2e38ae2d12f";

// Middleware to authenticate token
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    console.log("Verified User:", verified);  // Check if user is verified
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });

  }
  console.log("Token:", req.headers["authorization"]);

};
;

// Middleware to authorize based on roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
