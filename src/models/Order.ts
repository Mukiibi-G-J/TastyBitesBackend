import mongoose, { Schema, Document, Model } from "mongoose";

export interface OrderDoc extends Document {
  vendorId: string;
  customerId: string;
  foodId: string;
  quantity: number;
  price: string;
  totalprice: string;
  status: string;
}

const OrderSchema = new Schema(
  {
    vendorId: { type: String, required: true },
    customerId: { type: String, required: true },
    foodId: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalprice: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>("order", OrderSchema);

export { Order };
