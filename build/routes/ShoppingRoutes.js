"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var router = express_1.default.Router();
exports.ShoppingRoute = router;
/* ------------------- Food Availability --------------------- */
router.get('/:pincode', controllers_1.GetFoodAvailability);
/* ------------------- Top Restaurant --------------------- */
router.get('/top-restaurant/:pincode', controllers_1.GetTopRestaurants);
/* ------------------- ALL Restaurants --------------------- */
router.get('/all-restaurants/:pincode', controllers_1.GetAllRestaurants);
/* ------------------- Food Available in 30 Minutes --------------------- */
router.get('/foods-in-30-min/:pincode', controllers_1.GetFoodsIn30Min);
/* ------------------- Search Foods --------------------- */
router.get('/search/:pincode', controllers_1.SearchFoods);
/* ------------------- Search Offers --------------------- */
// router.get('/offers/:pincode', GetAvailableOffers);
/* ------------------- Find Restaurant by ID --------------------- */
router.get('/restaurant/:id', controllers_1.RestaurantById);
/* ----------------- find by Restaurant Name --------------------- */
router.get('/restaurant-name/:name', controllers_1.RestaurantByName);
router.post("/confirmorder", controllers_1.ConfrimOrder);
//# sourceMappingURL=ShoppingRoutes.js.map