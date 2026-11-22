import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProductPrices {
  PK?: number; // Pakistan
  FR?: number; // France
  US?: number; // United States
  IT?: number; // Italy
  ES?: number; // Spain
  OM?: number; // Oman
  SA?: number; // Saudi Arabia
}

export interface IProduct extends Document {
  name: string;
  description: string;
  image: string;
  category: Types.ObjectId;
  price: number; // Existing price - kept for compatibility
  prices?: IProductPrices;
  stock: number;
  status: "Active" | "Inactive";
}

const CountryPricesSchema = new Schema<IProductPrices>(
  {
    PK: { type: Number, min: 0 },
    FR: { type: Number, min: 0 },
    US: { type: Number, min: 0 },
    IT: { type: Number, min: 0 },
    ES: { type: Number, min: 0 },
    OM: { type: Number, min: 0 },
    SA: { type: Number, min: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    prices: {
      type: CountryPricesSchema,
      default: () => ({}),
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;



   