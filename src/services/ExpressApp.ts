import {
  AdminRoute,
  CustomerRoute,
  ShoppingRoute,
  VandorRoute,
} from "../routes";
import cors from "cors";
import path from "path";
import express, { Application } from "express";
// const cors = require('cors');

export default async (app: Application) => {
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true }));
  const imagePath = path.join(__dirname, "../images");
  console.log(imagePath);

  app.use("/images", express.static("../images"));

  app.use(
    cors({
      origin: "*",
    })
  );
  // app.get("/images", function(request, response) {
  //   response.render("image");
  //  });
  app.use("/admin", AdminRoute);
  app.use("/vandor", VandorRoute);
  app.use("/customer", CustomerRoute);
  app.use("/shopping", ShoppingRoute);
};
