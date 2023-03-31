import express, { Request, Response, NextFunction } from "express";
import { Customer, Food, FoodDoc, Vendor } from "../models";
import { Types } from "mongoose";
import { Order } from "../models/Order";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    // .sort([['rating', 'descending']])
    .populate("foods");
  if (result.length > 0) {
    const data = result.sort(() => Math.random() - 0.5);
    return res.status(200).json(data);
  }

  return res.status(404).json({ msg: "data Not found!" });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    // .sort([['rating', 'descending']])
    .limit(2);

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ msg: "data Not found!" });
};

export const GetAllRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = await Vendor.find().populate("foods");

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ msg: "data Not found!" });
};

export const GetFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    // .sort([['rating', 'descending']])
    .populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });
    return res.status(200).json(foodResult);
  }

  return res.status(404).json({ msg: "data Not found!" });
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((item) => foodResult.push(...item.foods));
    return res.status(200).json(foodResult);
  }
  return res.status(404).json({ msg: "data Not found!" });
};

export const RestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const result = await Vendor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ msg: "data Not found!" });
};

export const RestaurantByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const name = req.params.name;
  console.log(name);

  const result = await Vendor.findOne({ name: name }).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ msg: "Data not found!" });
};

// POST Order to DB

export const ConfrimOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { order } = req.body;
  const { email } = req.body;
  interface ordeInterface {
    id: string;
    image: string;
    name: string;
    price: string;
    quantity: number;
    totalprice: string;
  }
  // const myorder: ordeInterface[] =  order;
  // conver order to array of objects
  const myorder = JSON.parse(order);

  const customerQuery = Customer.findOne({ email: email }).exec();
  const customerId = await (await customerQuery)._id.toString();
  for (let i = 0; i < myorder.length; i++) {
    const foodIds = myorder[i].id;

    const result = await Vendor.findOne({ foods: { $in: foodIds } });

    //cerate order
    const newOrder = new Order({
      vendorId: (await result)._id.toString(),
      customerId: customerId,
      foodId: myorder[i].id,
      image: myorder[i].image,
      quantity: myorder[i].quantity,
      totalprice: myorder[i].totalprice,
      price: myorder[i].price,
      status: "pending",
    });
    await newOrder.save();
  }

  // create the order
  // vendorId: { type: String, required: true },
  // customerId: { type: String, required: true },
  // foodId: { type: String, required: true },
  // image: { type: String, required: true },
  // quantity: { type: Number, required: true },
  // totalprice: { type: String, required: true },
  // price: { type: String, required: true },
  // status:

  return res.status(200).json({ status: "Order created!" });

  // return res.status(404).json({ msg: "data Not found!" });
};
