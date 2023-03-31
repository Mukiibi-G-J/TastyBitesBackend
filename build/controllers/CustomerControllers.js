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
exports.GetOrdersStatus = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerLogin = exports.CustomerVerify = exports.CustomerSignUp = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var dto_1 = require("../dto");
var models_1 = require("../models");
var utils_1 = require("../utils");
var Order_1 = require("../models/Order");
var CustomerSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, validationError, email, phone, password, firstName, lastName, salt, userPassword, _a, otp, expiry, existingCustomer, subject, result, phone_1, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _b.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                email = customerInputs.email, phone = customerInputs.phone, password = customerInputs.password, firstName = customerInputs.firstName, lastName = customerInputs.lastName;
                return [4 /*yield*/, (0, utils_1.GenerateSalt)()];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, (0, utils_1.GeneratePassword)(password, salt)];
            case 3:
                userPassword = _b.sent();
                _a = (0, utils_1.GenerateOtp)(), otp = _a.otp, expiry = _a.expiry;
                return [4 /*yield*/, models_1.Customer.find({ email: email })];
            case 4:
                existingCustomer = _b.sent();
                subject = "Tast Bites";
                // sending mail  to the customer
                (0, utils_1.sendEmail)(email, subject, otp.toString());
                console.log(otp, expiry);
                // ?  return res.json('workking .........');
                // };
                // if (existingCustomer !== null)
                if (existingCustomer.length > 0) {
                    return [2 /*return*/, res.status(400).json({ message: "Email already exist!" })];
                }
                return [4 /*yield*/, models_1.Customer.create({
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
                    })];
            case 5:
                result = _b.sent();
                if (!result) return [3 /*break*/, 8];
                phone_1 = result.phone.startsWith("0")
                    ? result.phone.substring(1)
                    : result.phone;
                return [4 /*yield*/, (0, utils_1.onRequestOTP)(otp, phone_1)];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, utils_1.GenerateSignature)({
                        _id: result._id,
                        email: result.email,
                        verified: result.verified,
                    })];
            case 7:
                signature = _b.sent();
                // Send the result
                return [2 /*return*/, res
                        .status(201)
                        .json({ signature: signature, verified: result.verified, email: result.email })];
            case 8:
                console.log(email, phone, password, firstName, lastName);
                return [2 /*return*/, res.status(400).json({ msg: "Error while creating user" })];
        }
    });
}); };
exports.CustomerSignUp = CustomerSignUp;
var CustomerVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var otp, customer, profile, updatedCustomerResponse, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                otp = req.body.otp;
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                if (!(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date())) return [3 /*break*/, 4];
                profile.verified = true;
                return [4 /*yield*/, profile.save()];
            case 2:
                updatedCustomerResponse = _a.sent();
                return [4 /*yield*/, (0, utils_1.GenerateSignature)({
                        _id: updatedCustomerResponse._id,
                        email: updatedCustomerResponse.email,
                        verified: updatedCustomerResponse.verified,
                    })];
            case 3:
                signature = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        signature: signature,
                        email: updatedCustomerResponse.email,
                        verified: updatedCustomerResponse.verified,
                        firstName: updatedCustomerResponse.firstName,
                        lastName: updatedCustomerResponse.lastName,
                    })];
            case 4: return [2 /*return*/, res.status(400).json({ msg: "Unable to verify Customer" })];
        }
    });
}); };
exports.CustomerVerify = CustomerVerify;
var CustomerLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, validationError, email, password, customer, validation, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                email = customerInputs.email, password = customerInputs.password;
                return [4 /*yield*/, models_1.Customer.findOne({ email: email })];
            case 2:
                customer = _a.sent();
                if (!customer) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, utils_1.ValidatePassword)(password, customer.password, customer.salt)];
            case 3:
                validation = _a.sent();
                if (!validation) return [3 /*break*/, 6];
                if (!customer.verified) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, utils_1.GenerateSignature)({
                        _id: customer._id,
                        email: customer.email,
                        verified: customer.verified,
                    })];
            case 4:
                signature = _a.sent();
                console.log(signature);
                return [2 /*return*/, res.status(200).json({
                        msg: "logined successfully",
                        signature: signature,
                        email: customer.email,
                        verified: customer.verified,
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                    })];
            case 5: return [2 /*return*/, res.status(400).json({ msg: "Please Verify your account" })];
            case 6: return [2 /*return*/, res.json({ msg: "Error With Signup" })];
        }
    });
}); };
exports.CustomerLogin = CustomerLogin;
var RequestOtp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, _a, otp, expiry;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _b.sent();
                if (!profile) return [3 /*break*/, 4];
                _a = (0, utils_1.GenerateOtp)(), otp = _a.otp, expiry = _a.expiry;
                profile.otp = otp;
                profile.otp_expiry = expiry;
                return [4 /*yield*/, profile.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, utils_1.onRequestOTP)(otp, profile.phone)];
            case 3:
                _b.sent();
                return [2 /*return*/, res
                        .status(200)
                        .json({ message: "OTP sent to your registered Mobile Number!" })];
            case 4: return [2 /*return*/, res.status(400).json({ msg: "Error with Requesting OTP" })];
        }
    });
}); };
exports.RequestOtp = RequestOtp;
var GetCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (profile) {
                    return [2 /*return*/, res.status(201).json(profile)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(400).json({ msg: "Error while Fetching Profile" })];
        }
    });
}); };
exports.GetCustomerProfile = GetCustomerProfile;
var EditCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, customerInputs, validationError, firstName, lastName, address, profile, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                customerInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerProfileInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    return [2 /*return*/, res.status(400).json(validationError)];
                }
                firstName = customerInputs.firstName, lastName = customerInputs.lastName, address = customerInputs.address;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 2:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                return [4 /*yield*/, profile.save()];
            case 3:
                result = _a.sent();
                return [2 /*return*/, res.status(201).json(result)];
            case 4: return [2 /*return*/, res.status(400).json({ msg: "Error while Updating Profile" })];
        }
    });
}); };
exports.EditCustomerProfile = EditCustomerProfile;
var GetOrdersStatus = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, orders, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                return [4 /*yield*/, Order_1.Order.find({ customerId: profile._id })];
            case 2:
                orders = _a.sent();
                if (!orders) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all(orders
                        // sort the status  pending, completed, processing
                        .sort(function (a, b) { return (a.status > b.status ? 1 : -1); })
                        .map(function (order) { return __awaiter(void 0, void 0, void 0, function () {
                        var food, vendor;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, models_1.Food.findById(order.foodId)];
                                case 1:
                                    food = _a.sent();
                                    return [4 /*yield*/, models_1.Vendor.findById(order.vendorId)];
                                case 2:
                                    vendor = _a.sent();
                                    return [2 /*return*/, __assign(__assign({ _id: order._id }, order["_doc"]), { 
                                            //format the date
                                            foodName: food.name, vendorName: vendor.name, status: order.status })];
                            }
                        });
                    }); }))];
            case 3:
                response = _a.sent();
                console.log(response);
                return [2 /*return*/, res.status(200).json(response)];
            case 4: return [2 /*return*/, res.status(400).json({ msg: "Error while Fetching Orders" })];
        }
    });
}); };
exports.GetOrdersStatus = GetOrdersStatus;
//# sourceMappingURL=CustomerControllers.js.map