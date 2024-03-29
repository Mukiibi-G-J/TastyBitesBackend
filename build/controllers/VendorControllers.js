"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrders = exports.GetFoods = exports.UpdateVendorCoverImage = exports.AddFood = exports.UpdateVendorService = exports.UpdateVendorProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
var AdminController_1 = require("./AdminController");
var utils_1 = require("../utils");
var models_1 = require("../models");
var Order_1 = require("../models/Order");
var cloudinary = require("cloudinary").v2;
var VendorLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingUser, validation, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, AdminController_1.FindVendor)("", email)];
            case 1:
                existingUser = _b.sent();
                if (!(existingUser !== null)) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, utils_1.ValidatePassword)(password, existingUser.password, existingUser.salt)];
            case 2:
                validation = _b.sent();
                if (!validation) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, utils_1.GenerateSignature)({
                        _id: existingUser._id,
                        email: existingUser.email,
                        name: existingUser.name,
                        foodType: existingUser.foodType,
                    })];
            case 3:
                signature = _b.sent();
                return [2 /*return*/, res.json({ signature: signature, name: existingUser.name })];
            case 4: return [2 /*return*/, res.json({ messege: "Password isn not valid" })];
            case 5: return [2 /*return*/, res.json({ message: "Login credential is not valid" })];
        }
    });
}); };
exports.VendorLogin = VendorLogin;
var GetVendorProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, existingVendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                existingVendor = _a.sent();
                return [2 /*return*/, res.json(existingVendor)];
            case 2: return [2 /*return*/, res.json({ message: "vendor Information Not Found" })];
        }
    });
}); };
exports.GetVendorProfile = GetVendorProfile;
var UpdateVendorProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, foodType, name, address, phone, existingVendor, saveResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                _a = req.body, foodType = _a.foodType, name = _a.name, address = _a.address, phone = _a.phone;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                existingVendor = _b.sent();
                if (!(existingVendor !== null)) return [3 /*break*/, 3];
                existingVendor.name = name;
                existingVendor.address;
                existingVendor.phone = phone;
                existingVendor.foodType = foodType;
                return [4 /*yield*/, existingVendor.save()];
            case 2:
                saveResult = _b.sent();
                return [2 /*return*/, res.json(saveResult)];
            case 3: return [2 /*return*/, res.json({ message: "Unable to Update vendor profile " })];
        }
    });
}); };
exports.UpdateVendorProfile = UpdateVendorProfile;
var UpdateVendorService = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, existingVendor, saveResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                existingVendor = _a.sent();
                if (!(existingVendor !== null)) return [3 /*break*/, 3];
                existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
                return [4 /*yield*/, existingVendor.save()];
            case 2:
                saveResult = _a.sent();
                return [2 /*return*/, res.json(saveResult)];
            case 3: return [2 /*return*/, res.json({ message: "Unable to Update vendor profile " })];
        }
    });
}); };
exports.UpdateVendorService = UpdateVendorService;
var AddFood = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, name, description, category, foodType, readyTime, price, vendor, files, filename, result_img, food, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                _a = req.body, name = _a.name, description = _a.description, category = _a.category, foodType = _a.foodType, readyTime = _a.readyTime, price = _a.price;
                if (!user) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                vendor = _b.sent();
                if (!(vendor !== null)) return [3 /*break*/, 5];
                files = req.files;
                filename = files[0].filename;
                cloudinary.config({
                    cloud_name: "dbyhl9rtv",
                    api_key: "329463643862855",
                    api_secret: "FAw4lp5EGACZs4kO00Opx7UJNZE",
                });
                return [4 /*yield*/, cloudinary.uploader.upload(files[0].path, {
                        public_id: "".concat(filename),
                    })];
            case 2:
                result_img = _b.sent();
                console.log(req);
                return [4 /*yield*/, models_1.Food.create({
                        vendorId: vendor._id,
                        name: name,
                        description: description,
                        category: category,
                        price: price,
                        rating: 0,
                        readyTime: readyTime,
                        foodType: foodType,
                        images: result_img.secure_url,
                    })];
            case 3:
                food = _b.sent();
                // //! updating the vendor with the new food created
                vendor.foods.push(food._id);
                return [4 /*yield*/, vendor.save()];
            case 4:
                result = _b.sent();
                return [2 /*return*/, res.json(result)];
            case 5: return [2 /*return*/, res.json({ message: "Unable to Update vendor profile " })];
        }
    });
}); };
exports.AddFood = AddFood;
var UpdateVendorCoverImage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, vendor, files, filename, result_img, images, saveResult;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                vendor = _b.sent();
                if (!(vendor !== null)) return [3 /*break*/, 4];
                files = req.files;
                filename = files[0].filename;
                cloudinary.config({
                    cloud_name: "dbyhl9rtv",
                    api_key: "329463643862855",
                    api_secret: "FAw4lp5EGACZs4kO00Opx7UJNZE",
                });
                return [4 /*yield*/, cloudinary.uploader.upload(files[0].path, {
                        public_id: "".concat(filename),
                    })];
            case 2:
                result_img = _b.sent();
                images = [result_img.secure_url];
                (_a = vendor.coverImages).push.apply(_a, images);
                return [4 /*yield*/, vendor.save()];
            case 3:
                saveResult = _b.sent();
                return [2 /*return*/, res.json(saveResult)];
            case 4: return [2 /*return*/, res.json({ message: "Unable to Update vendor profile " })];
        }
    });
}); };
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
var GetFoods = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, foods;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Food.find({ vendorId: user._id })];
            case 1:
                foods = _a.sent();
                if (foods !== null) {
                    return [2 /*return*/, res.json(foods)];
                }
                else {
                    return [2 /*return*/, res.json({ message: "No food found" })];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.json({ message: "Foods not found!" })];
        }
    });
}); };
exports.GetFoods = GetFoods;
var GetOrders = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, orderId, status_1, orderUpdate, user, orders, responseArray, i, order, food, customer, firstName, lastName, fullName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(req.method === "PUT")) return [3 /*break*/, 3];
                _a = req.body, orderId = _a.orderId, status_1 = _a.status;
                //? get the order
                console.log(orderId, status_1);
                orderUpdate = Order_1.Order.findByIdAndUpdate(orderId, { status: status_1 }, { new: true });
                if (!orderUpdate) return [3 /*break*/, 3];
                return [4 /*yield*/, orderUpdate];
            case 1: 
            //? save the order
            return [4 /*yield*/, (_b.sent()).save()];
            case 2:
                //? save the order
                _b.sent();
                return [2 /*return*/, res.json({ message: "Order Updated" })];
            case 3:
                user = req.user;
                if (!user) return [3 /*break*/, 10];
                return [4 /*yield*/, Order_1.Order.find({ vendorId: user._id })];
            case 4:
                orders = _b.sent();
                responseArray = [];
                i = 0;
                _b.label = 5;
            case 5:
                if (!(i < orders.length)) return [3 /*break*/, 9];
                order = orders[i];
                return [4 /*yield*/, models_1.Food.findOne({ _id: order.foodId })];
            case 6:
                food = _b.sent();
                return [4 /*yield*/, models_1.Customer.findOne({ _id: order.customerId })];
            case 7:
                customer = _b.sent();
                firstName = customer ? customer.firstName : "Customer";
                lastName = customer ? customer.lastName : "Name";
                fullName = firstName + " " + lastName;
                // const updatedAt = new Date(order.["_doc"].updatedAt); // [order["_doc"].updatedAt
                // const updated_date = updatedAt.toLocaleString();
                // const createdAt = new Date(order.createdAt); // [order["_doc"].updatedAt
                // const created_date = createdAt.toLocaleString();
                responseArray.push(__assign(__assign({}, order["_doc"]), { foodName: food.name, customerName: fullName }));
                console.log(i);
                if (i === orders.length) {
                    return [3 /*break*/, 9];
                }
                _b.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 5];
            case 9: 
            // console.log(responseArray);
            return [2 /*return*/, res.json(responseArray)];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.GetOrders = GetOrders;
//# sourceMappingURL=VendorControllers.js.map