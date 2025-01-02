import { Router } from "express";
import Product from "../models/product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/create", authMiddleware, (req, res) => {
  res.render("create", {
    createError: null,
  });
});
router.get("/products", (req, res) => {
  res.render("products");
});

router.post("/create", authMiddleware, async (req, res) => {
  const { product_name, price, img, description } = req.body;
  if (!product_name && !price && !img && !description) {
    res.status(400).render("create", {
      createError: "All fields are required",
    });
    return;
  }
  await Product.create({ ...req.body, userId: req.UserId });
  res.redirect("/");
});
export default router;
