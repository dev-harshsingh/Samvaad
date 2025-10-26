import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token found" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to access this route" });
    }
    next();
  };
};

export { protect, authorizeRoles };
