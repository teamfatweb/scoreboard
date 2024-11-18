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
const client_1 = __importDefault(require("../../utils/client"));
const auth_1 = __importDefault(require("../../utils/auth"));
const listUsers = (role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (role === "superAdmin") {
            const users = yield client_1.default.user.findMany({
                where: {
                    role: "admin",
                },
                orderBy: {
                    name: "asc",
                },
            });
            const sellers = yield client_1.default.seller.findMany();
            return [...users, ...sellers];
        }
        if (role === "admin") {
            const users = yield client_1.default.seller.findMany({
                orderBy: {
                    name: "asc",
                },
            });
            return users;
        }
    }
    catch (err) {
        return err;
    }
});
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.default.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    }
    catch (err) {
        return err;
    }
});
const getUserByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use findMany because 'name' is not unique
        const sellers = yield client_1.default.seller.findMany({
            where: {
                name: name,
            },
        });
        // Return the first seller if found, otherwise return null
        return sellers.length > 0 ? sellers[0] : null;
    }
    catch (err) {
        console.error('Error fetching seller by name:', err);
        throw err; // Rethrow error to be handled by the calling function
    }
});
const createUser = (name, email, targetAmount, password, role, avatar, currentTarget) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (role === 'superAdmin' || role === 'admin') {
            // Hash password for admin/superAdmin
            const hashed = yield auth_1.default.hashPassword(password);
            const user = yield client_1.default.user.create({
                data: {
                    name,
                    email,
                    password: hashed,
                    role,
                    avatar,
                    // 'currentTarget' should not be here if it's not a field in the user model
                },
            });
            return user;
        }
        else if (role === 'seller') {
            const seller = yield client_1.default.seller.create({
                data: {
                    name: name,
                    targetAmount: targetAmount,
                    avatar: avatar,
                    email: email,
                    currentTarget: currentTarget // Assuming 'currentTarget' is a valid field in the seller model
                },
            });
            return seller;
        }
        else {
            throw new Error('Invalid role specified.');
        }
    }
    catch (err) {
        // Log the error for debugging purposes
        console.error("Error in createUser:", err);
        throw err; // Throw the error to be handled by the calling function
    }
});
const updateUser = (email, newName, targetAmount, currentTarget, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (role === 'admin') {
            const user = yield client_1.default.user.update({
                where: {
                    email,
                },
                data: {
                    name: newName,
                },
            });
            return user;
        }
        else {
            const seller = yield client_1.default.seller.update({
                where: {
                    email,
                },
                data: {
                    targetAmount,
                    currentTarget,
                },
            });
            return seller;
        }
    }
    catch (err) {
        throw new Error('Failed to update user.');
    }
});
const deleteUser = (email, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(`Attempting to delete user with email: ${email} and role: ${role}`);
        // Ensure valid role is specified
        if (role === 'seller') {
            // Delete seller by name
            const deletedSeller = yield client_1.default.seller.delete({
                where: {
                    email: email,
                },
            });
            // console.log('Seller deletion result:', deletedSeller);
            return deletedSeller;
        }
        else if (role === 'admin') {
            // Delete user by email
            const deletedUser = yield client_1.default.user.delete({
                where: {
                    email,
                },
            });
            // console.log('Admin deletion result:', deletedUser);
            return deletedUser;
        }
        else {
            // If role is invalid
            throw new Error("Invalid role specified for deletion.");
        }
    }
    catch (err) {
        // Log detailed error information
        // console.error('Detailed error during user deletion:', err);
        // Return an appropriate error response
        if (err instanceof Error) {
            return {
                status: 500,
                message: err.message,
            };
        }
        return {
            status: 500,
            message: "Failed to delete user or seller.",
        };
    }
});
exports.default = {
    getUserByEmail,
    getUserByName,
    createUser,
    listUsers,
    updateUser,
    deleteUser,
};
