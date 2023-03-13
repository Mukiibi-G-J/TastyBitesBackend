import { CreateFoodInput, EditVendorInput, VendorLoginInput } from "../dto";
import { Request, Response, NextFunction } from "express";
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utils";
import { Food } from "../models";
const cloudinary = require("cloudinary").v2;

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;
  console.log(email)
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
      return res.json(signature);
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
        public_id:`${filename}`,
      });

      console.log(result_img);

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
      //! updating the vendor with the new food created
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
        public_id:`${filename}`,
      });
      const images = [result_img.secure_url]

      
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
    }
    else{
      return res.json({message:"No food found"})
    }
  }
  return res.json({ message: "Foods not found!" });
};
