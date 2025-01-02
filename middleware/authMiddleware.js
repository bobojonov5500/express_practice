import jwt from "jsonwebtoken";

export default function (req, res, next) {
  if (!req.cookies.jwt) {
    res.redirect("/login");
    return;
  }
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SEC);
  req.UserId = decoded.UserId;
  next();
}
