import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    //Read authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    //extract token
    const token = authHeader.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //attach user to request
    req.user = decoded;

    next();
  } catch (error) {}
  return res.status(401).json({ message: "Not authorized, token failed" });
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
