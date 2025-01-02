import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    product_name: { type: String, required: true },
    price: { type: String, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Product = model("Products", ProductSchema);
export default Product;
