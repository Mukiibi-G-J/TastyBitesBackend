import express, { Request, Response, NextFunction } from 'express';
import {
  GetFoodAvailability,
  // GetAvailableOffers,
  GetFoodsIn30Min,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
  GetAllRestaurants,
  RestaurantByName,
  ConfrimOrder
} from '../controllers';

const router = express.Router();

/* ------------------- Food Availability --------------------- */
router.get('/:pincode', GetFoodAvailability);

/* ------------------- Top Restaurant --------------------- */
router.get('/top-restaurant/:pincode', GetTopRestaurants);


/* ------------------- ALL Restaurants --------------------- */
router.get('/all-restaurants/:pincode', GetAllRestaurants);

/* ------------------- Food Available in 30 Minutes --------------------- */
router.get('/foods-in-30-min/:pincode', GetFoodsIn30Min);

/* ------------------- Search Foods --------------------- */
router.get('/search/:pincode', SearchFoods);

/* ------------------- Search Offers --------------------- */
// router.get('/offers/:pincode', GetAvailableOffers);

/* ------------------- Find Restaurant by ID --------------------- */
router.get('/restaurant/:id', RestaurantById);
 

/* ----------------- find by Restaurant Name --------------------- */
router.get('/restaurant-name/:name', RestaurantByName);

router.post("/confirmorder", ConfrimOrder);

export { router as ShoppingRoute };
