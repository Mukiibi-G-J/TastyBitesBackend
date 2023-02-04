import {
  AdminRoute,
  CustomerRoute,
  ShoppingRoute,
  VandorRoute,
} from '../routes';
import cors from 'cors';
import path from 'path';
import express, { Application } from 'express';

export default async (app: Application) => {
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true }));
  // const imagePath = path.join(__dirname, '../images');

  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.use('/admin', AdminRoute);
  app.use('/vandor', VandorRoute);
  app.use('/customer', CustomerRoute);

  app.use(ShoppingRoute);
};
