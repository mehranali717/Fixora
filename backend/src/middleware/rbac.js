import AppError from "../utils/AppError.js";

const allowRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new AppError("Forbidden", 403);
  }
  next();
};

export default allowRoles;
