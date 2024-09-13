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
const target_service_1 = __importDefault(require("./target.service")); // Import your service
class TargetController {
    updateTarget(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sellerId, amount } = req.body;
                if (typeof sellerId === 'undefined' || typeof amount === 'undefined') {
                    res.status(400).json({ message: 'Seller ID and amount are required' });
                    return;
                }
                const parsedSellerId = parseInt(sellerId, 10);
                const parsedAmount = parseFloat(amount);
                if (isNaN(parsedSellerId) || isNaN(parsedAmount)) {
                    res.status(400).json({ message: 'Invalid Seller ID or amount' });
                    return;
                }
                yield target_service_1.default.updateTarget(parsedSellerId, parsedAmount);
                res.status(200).json({ message: 'Target updated successfully' });
            }
            catch (error) {
                console.error(`Error in updateTarget: ${error}`);
                res.status(500).json({ message: 'Error updating target. Please try again later.' });
            }
        });
    }
}
exports.default = TargetController;
