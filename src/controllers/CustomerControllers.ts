import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import express, { Request, Response, NextFunction } from "express";
import {
  CreateCustomerInput,
  EditCustomerProfileInput,
  UserLoginInput,
} from "../dto";
import { Customer, Food, Vendor } from "../models";
import {
  GenerateOtp,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  onRequestOTP,
  sendEmail,
  ValidatePassword,
} from "../utils";
import { Order } from "../models/Order";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, phone, password, firstName, lastName } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOtp();

  const existingCustomer = await Customer.find({ email: email });
  const subject = "Tast Bites";
  // sending mail  to the customer
  sendEmail(email, subject, otp.toString());

  console.log(otp, expiry);
  // ?  return res.json('workking .........');
  // };
  // if (existingCustomer !== null)
  if (existingCustomer.length > 0) {
    return res.status(400).json({ message: "Email already exist!" });
  }

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: firstName,
    lastName: lastName,
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
    orders: [],
  });

  if (result) {
    // send OTP to customer
    // removing the first 0 from the phone number if it exists
    const phone = result.phone.startsWith("0")
      ? result.phone.substring(1)
      : result.phone;

    await onRequestOTP(otp, phone);

    // Generate the Signature
    const signature = await GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    // Send the result
    return res
      .status(201)
      .json({ signature, verified: result.verified, email: result.email });
  }
  console.log(email, phone, password, firstName, lastName);
  return res.status(400).json({ msg: "Error while creating user" });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;
  // console.log(otp);

  if (customer) {
    const profile = await Customer.findById(customer._id);
    // console.log(profile);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        const signature = await GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });

        return res.status(200).json({
          signature,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
          firstName: updatedCustomerResponse.firstName,
          lastName: updatedCustomerResponse.lastName,
        });
      }
    }
    // else{
    //   return res.status(400).json({ msg: 'Unable to verify Customer' });
    // }
  }

  return res.status(400).json({ msg: "Unable to verify Customer" });
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(UserLoginInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { email, password } = customerInputs;
  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      if (customer.verified) {
        const signature = await GenerateSignature({
          _id: customer._id,
          email: customer.email,
          verified: customer.verified,
        });
        console.log(signature);
        return res.status(200).json({
          msg: "logined successfully",
          signature: signature,
          email: customer.email,
          verified: customer.verified,
          firstName: customer.firstName,
          lastName: customer.lastName,
        });
      } else {
        return res.status(400).json({ msg: "Please Verify your account" });
      }

      // const signature: Promise<string>
    }
  }

  return res.json({ msg: "Error With Signup" });
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      await onRequestOTP(otp, profile.phone);

      return res
        .status(200)
        .json({ message: "OTP sent to your registered Mobile Number!" });
    }
  }

  return res.status(400).json({ msg: "Error with Requesting OTP" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(201).json(profile);
    }
  }
  return res.status(400).json({ msg: "Error while Fetching Profile" });
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    return res.status(400).json(validationError);
  }

  const { firstName, lastName, address } = customerInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();

      return res.status(201).json(result);
    }
  }
  return res.status(400).json({ msg: "Error while Updating Profile" });
};
export const GetOrdersStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      // find orders where customerid = profile._id
      const orders = await Order.find({ customerId: profile._id });
      if (orders) {
        // use Promise.all() to wait for all the promises to resolve
        const response = await Promise.all(
          orders
          // sort the status  pending, completed, processing
          .sort((a, b) => ( a.status > b.status ? 1 : -1))
          .map(async (order) => {
            // get food name from food id
            const food = await Food.findById(order.foodId);
            const vendor = await Vendor.findById(order.vendorId);

            return {
              _id: order._id,
              ...order["_doc"],
              //format the date

              foodName: food.name,
              vendorName: vendor.name,
              status: order.status,
            };
          })
        );
        console.log(response);
        return res.status(200).json(response);
      }
    }
  }
  return res.status(400).json({ msg: "Error while Fetching Orders" });
};
