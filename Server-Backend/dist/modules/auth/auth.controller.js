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
const auth_service_1 = __importDefault(require("./auth.service"));
const auth_1 = __importDefault(require("../../utils/auth"));
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield auth_service_1.default.getUser(email);
                if (!user ||
                    !(yield auth_1.default.validatePassword(password, user.password))) {
                    console.warn("Invalid login attempt:", { email });
                    return {
                        status: 400,
                        message: "Invalid username or password",
                    };
                }
                const token = auth_1.default.generateAccessToken(user.email, user.role);
                return {
                    status: 200,
                    payload: token,
                };
            }
            catch (err) {
                return {
                    status: 500,
                    message: err,
                };
            }
        });
    }
}
exports.default = AuthController;
