import express from "express";
import { engine, create } from "express-handlebars";
import AuthRoutes from "./routes/auth.js";
import ProductRoutes from "./routes/products.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";
import tokenMiddleare from "./middleware/tokenMiddleare.js";
const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(tokenMiddleare);

app.use(AuthRoutes);
app.use(ProductRoutes);

const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.MANGO_URI);
    console.log("mango db connected");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log("listening on: " + PORT));
  } catch (error) {
    console.log(error);
  }
};
DBconnection();
