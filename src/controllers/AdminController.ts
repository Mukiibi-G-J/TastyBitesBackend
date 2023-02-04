import { Request, Response, NextFunction, response } from 'express';
import { CreateVandorInput } from '../dto';
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utils';
//!email? means we are making it to be optional
export const FindVendor = async (id: String | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};
export const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } =
    //? Asepting only the paramerts in the createVandorInput
    <CreateVandorInput>req.body;
  //? Creating a new vendor
  // const existingVandor = await Vendor.findOne({ email: email });
  const existingVandor = await FindVendor('', email);

  if (existingVandor != null) {
    return res.json({ message: 'A vendor exist with thi email' });
  }
  //!generate a salt
  const salt = await GenerateSalt();

  //!encrypt the password using the salt
  const userPassword = await GeneratePassword(password, salt);

  const createdVandor = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
  });

  return res.json(createdVandor);
};

export const GetVanndors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();
  //! meaning if vendor not null
  if (vendors !== null) {
    return res.json(vendors);
  }
  return res.json({ message: 'Vendors data not available' });
};

export const GetVandorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.id;
  // const vendors = await Vendor.findById(vendorId);
  const vendors = await FindVendor(vendorId);

  if (vendors !== null) {
    return res.json(vendors);
  }
  return res.json({ message: 'Vendors data not available' });
};
