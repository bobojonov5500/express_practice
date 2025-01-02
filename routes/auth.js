import { Router } from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { TokenGenerate } from "../services/token.js";
const router = Router();

// login
router.get("/login", (req, res) => {
  if (req.cookies.jwt) {
    res.redirect("/");
    return;
  }
  res.render("login", {
    isLoginError: null,
  });
});

//logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

// register
router.get("/register", (req, res) => {
  if (req.cookies.jwt) {
    res.redirect("/");
    return;
  }
  res.render("register", {
    isRegisterError: null,
  });
});

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login", {
        isLoginError: errors.array()[0].msg,
      });
    }
    const existUser = await User.findOne({ email: req.body.email });
    if (!existUser) {
      return res.status(400).render("login", {
        isLoginError: "User is not found",
      });
    }
    const isPasswordEqual = await bcrypt.compare(
      req.body.password[0],
      existUser.password
    );
    if (!isPasswordEqual) {
      return res.status(400).render("login", {
        isLoginError: "Password is wrong",
      });
    }

    const token = TokenGenerate(existUser._id);
    res.cookie("jwt", token, { httpOnly: true, secure: true });
    res.redirect("/");
  }
);

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("surname").notEmpty().withMessage("Surname is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 character"),
    body("passwordConfirm")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Password does not suit"),
  ],
  async (req, res) => {
    const { email, password, passwordConfirm } = req.body;
    const existEmail = await User.findOne({ email });
    const errors = validationResult(req);
    if (password !== passwordConfirm) {
      return res.status(400).render("register", {
        isRegisterError: "Confirm password is wrong",
      });
    }
    if (!errors.isEmpty()) {
      return res.status(400).render("register", {
        isRegisterError: "All fields are required",
      });
    }
    if (existEmail) {
      return res.status(400).render("register", {
        isRegisterError: "Email is already available",
      });
    }
    const HashedPassword = await bcrypt.hash(req.body.password[0], 10);
    const userData = {
      firstName: req.body.name,
      lastName: req.body.surname,
      email: req.body.email,
      password: HashedPassword,
    };
    const user = await User.create(userData);
    res.redirect("/login");
  }
);
export default router;
