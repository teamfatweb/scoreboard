"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
class UserController {
    /**
     * List users based on role.
     * @param req
     * @param res
     */
    listUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role } = req.body.user;
            try {
                const users = yield user_service_1.default.listUsers(role);
                res.status(200).json(users);
            }
            catch (err) {
                console.error('Error listing users:', err);
                res.status(500).json({
                    status: 500,
                    message: err instanceof Error ? err.message : "An unknown error occurred",
                });
            }
        });
    }
    /**
     * Create a new user.
     * @param req
     * @param res
     */
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, targetAmount, password, role } = req.body;
            const avatar = "";
            // Validate input
            if (!name || !email || typeof targetAmount !== 'number' || (role === 'superAdmin' && !password) || !role) {
                res.status(400).json({
                    status: 400,
                    message: "Invalid input data",
                });
            }
            else {
                try {
                    let existingUser;
                    // Check if user already exists
                    if (role !== "seller") {
                        existingUser = yield user_service_1.default.getUserByEmail(email);
                    }
                    else {
                        existingUser = yield user_service_1.default.getUserByName(name);
                    }
                    if (existingUser) {
                        res.status(400).json({
                            status: 400,
                            message: "User already exists!",
                        });
                    }
                    else {
                        // Create new user
                        const newUser = yield user_service_1.default.createUser(name, email, Number(targetAmount), password, role, avatar, Number(targetAmount));
                        res.status(201).json({
                            status: 201,
                            payload: newUser,
                        });
                    }
                }
                catch (err) {
                    console.error('Error creating user:', err);
                    res.status(500).json({
                        status: 500,
                        message: err instanceof Error ? err.message : "An unknown error occurred",
                    });
                }
            }
        });
    }
    /**
     * Update user details.
     * @param req
     * @param res
     */
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, name, targetAmount, currentTarget, role } = req.body;
            try {
                const updatedUser = yield user_service_1.default.updateUser(email, name, Number(targetAmount), Number(currentTarget), role);
                res.status(200).json({
                    status: 200,
                    payload: updatedUser,
                });
            }
            catch (err) {
                console.error('Error updating user:', err);
                res.status(500).json({
                    status: 500,
                    message: err instanceof Error ? err.message : "An unknown error occurred",
                });
            }
        });
    }
    /**
     * Delete a user.
     * @param req
     * @param res
     */
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, role } = req.body;
            try {
                const deletedUser = yield user_service_1.default.deleteUser(email, role);
                res.status(200).json({
                    status: 200,
                    message: "User deleted successfully.",
                    payload: deletedUser,
                });
            }
            catch (err) {
                console.error('Error deleting user:', err);
                res.status(500).json({
                    status: 500,
                    message: err instanceof Error ? err.message : "An unknown error occurred",
                });
            }
        });
    }
}
exports.default = UserController;
