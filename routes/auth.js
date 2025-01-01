import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", (req, res) => {
  res.redirect("/");
});
router.post("/register", async (req, res) => {
  if (req.body.password[0] === req.body.password[1]) {
    const HashedPassword = await bcrypt.hash(req.body.password[0], 10);
    const userData = {
      firstName: req.body.name,
      lastName: req.body.surname,
      email: req.body.email,
      password: HashedPassword,
    };
    const user = await User.create(userData);
    res.redirect("/");
    console.log(user);
  } else {
    return { ErrorPassword: "Password does not match to each other!!!" };
  }
});
export default router;
