import {
  CreateFoodInput,
  EditVendorInput,
  UpdateOrderInput,
  VendorLoginInput,
} from "../dto";
import { Request, Response, NextFunction } from "express";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utils";
import { Customer, Food } from "../models";
import { Order } from "../models/Order";
import { couldStartTrivia } from "typescript";
const cloudinary = require("cloudinary").v2;

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;

  const existingUser = await FindVendor("", email);
  if (existingUser !== null) {
    const validation = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt
    );
    if (validation) {
      const signature = await GenerateSignature({
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        foodType: existingUser.foodType,
      });
      return res.json({ signature: signature, name: existingUser.name });
    } else {
      return res.json({ messege: "Password isn not valid" });
    }
  }

  return res.json({ message: "Login credential is not valid" });
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    return res.json(existingVendor);
  }
  return res.json({ message: "vendor Information Not Found" });
};

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { foodType, name, address, phone } = <EditVendorInput>req.body;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.address;
      existingVendor.phone = phone;
      existingVendor.foodType = foodType;
      const saveResult = await existingVendor.save();
      return res.json(saveResult);
    }
  }
  return res.json({ message: "Unable to Update vendor profile " });
};

export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);

    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      //  if(lat && lng){
      //      existingVendor.lat = lat;
      //      existingVendor.lng = lng;
      //  }
      const saveResult = await existingVendor.save();

      return res.json(saveResult);
    }
  }
  return res.json({ message: "Unable to Update vendor profile " });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { name, description, category, foodType, readyTime, price } = <
    CreateFoodInput
  >req.body;

  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];
      const filename = files[0].filename;
      cloudinary.config({
        cloud_name: "dbyhl9rtv",
        api_key: "329463643862855",
        api_secret: "FAw4lp5EGACZs4kO00Opx7UJNZE",
      });

      const result_img = await cloudinary.uploader.upload(files[0].path, {
        public_id: `${filename}`,
      });

      console.log(req);

      const food = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        price: price,
        rating: 0,
        readyTime: readyTime,
        foodType: foodType,
        images: result_img.secure_url,
      });
      // //! updating the vendor with the new food created
      vendor.foods.push(food._id);

      const result = await vendor.save();

      return res.json(result);
    }
  }

  return res.json({ message: "Unable to Update vendor profile " });
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vendor = await FindVendor(user._id);

    if (vendor !== null) {
      const files = req.files as [Express.Multer.File];

      // const images = files.map((file: Express.Multer.File) => file.filename);
      const filename = files[0].filename;
      cloudinary.config({
        cloud_name: "dbyhl9rtv",
        api_key: "329463643862855",
        api_secret: "FAw4lp5EGACZs4kO00Opx7UJNZE",
      });

      const result_img = await cloudinary.uploader.upload(files[0].path, {
        public_id: `${filename}`,
      });
      const images = [result_img.secure_url];

      vendor.coverImages.push(...images);

      const saveResult = await vendor.save();

      return res.json(saveResult);
    }
  }
  return res.json({ message: "Unable to Update vendor profile " });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });

    if (foods !== null) {
      return res.json(foods);
    } else {
      return res.json({ message: "No food found" });
    }
  }
  return res.json({ message: "Foods not found!" });
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check if it is a put request
  if (req.method === "PUT") {
    const { orderId, status } = <UpdateOrderInput>req.body;
    //? get the order
    console.log(orderId, status);
    const orderUpdate = Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );
    if (orderUpdate) {
      //? save the order
      await (await orderUpdate).save();

      return res.json({ message: "Order Updated" });
    }
  }

  // get all orders for the db
  const user = req.user;
  if (user) {
    const orders = await Order.find({ vendorId: user._id });
    const responseArray = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const food = await Food.findOne({ _id: order.foodId });
      const customer = await Customer.findOne({ _id: order.customerId });
      const firstName = customer ? customer.firstName : "Customer";
      const lastName = customer ? customer.lastName : "Name";
      const fullName = firstName + " " + lastName;
      // const updatedAt = new Date(order.["_doc"].updatedAt); // [order["_doc"].updatedAt
      // const updated_date = updatedAt.toLocaleString();
      // const createdAt = new Date(order.createdAt); // [order["_doc"].updatedAt
      // const created_date = createdAt.toLocaleString();

      responseArray.push({
        ...order["_doc"],
        foodName: food.name,
        customerName: fullName,
        // createdAt: created_date,
        // updatedAt: updated_date,
        // const date = new Date(row.updatedAt); date.toLocaleString()
      });
      console.log(i);
      if (i === orders.length) {
        break;
      }
    }

    // console.log(responseArray);
    return res.json(responseArray);
  }
};
