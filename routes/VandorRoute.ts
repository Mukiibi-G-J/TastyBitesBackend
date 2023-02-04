import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
// const multer = require('multer');

import {
  AddFood,
  GetFoods,
  GetVendorProfile,
  UpdateVendorCoverImage,
  UpdateVendorProfile,
  UpdateVendorService,
  VendorLogin,
} from '../controllers';
import { Authenticate } from '../middlewares';
const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '_' + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array('images', 10);

router.post('/login', VendorLogin);
router.use(Authenticate);
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/coverimage', images, UpdateVendorCoverImage);
router.patch('/service', UpdateVendorService);

router.post('/food', images, AddFood);
router.get('/food', GetFoods);

// router.get('/orders', GetOrders);
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Hello from Vandor' });
});

export { router as VandorRoute };
