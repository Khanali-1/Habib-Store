import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  key: string;

  profile: {
    name: string;
    email: string;
    phone: string;
  };

  store: {
    name: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    tax: number;
  };

  notifications: {
    newOrders: boolean;
    orderUpdates: boolean;
    lowStock: boolean;
    newCustomers: boolean;
    marketing: boolean;
  };

  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
  };
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
    },

    profile: {
      name: { type: String, default: "Admin" },
      email: { type: String, default: "admin@hstore.com" },
      phone: { type: String, default: "" },
    },

    store: {
      name: { type: String, default: "H Store" },
      email: { type: String, default: "contact@hstore.com" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      currency: { type: String, default: "PKR" },
      tax: { type: Number, default: 0, min: 0, max: 100 },
    },

    notifications: {
      newOrders: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      newCustomers: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
    },

    preferences: {
      language: { type: String, default: "English" },
      timezone: { type: String, default: "Asia/Karachi" },
      dateFormat: { type: String, default: "DD/MM/YYYY" },
    },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
