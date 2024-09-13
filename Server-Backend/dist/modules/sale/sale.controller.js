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
const sale_service_1 = __importDefault(require("./sale.service"));
class SaleController {
    /**
     * List all sales
     * @param req
     * @param res
     */
    listSales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sales = yield sale_service_1.default.listSales();
                res.status(200).json(sales); // Changed to 200 OK
            }
            catch (err) {
                console.error(err); // Log the error
                res.status(500).json({
                    status: 500,
                    error: err instanceof Error ? err.message : "An unknown error occurred",
                });
            }
        });
    }
    /**
     * Add a new sale
     * @param req
     * @param res
     */
    addSale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, amount } = req.body;
            // Basic input validation
            if (!userId || typeof userId !== 'number' || isNaN(userId) ||
                !amount || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid input data",
                });
            }
            try {
                // Ensure amount is a valid number and formatted correctly
                const formattedAmount = parseFloat(amount.toFixed(2));
                const newSale = yield sale_service_1.default.createSale(formattedAmount, Number(userId), new Date());
                res.status(201).json({
                    status: 201,
                    payload: newSale,
                });
            }
            catch (err) {
                console.error('Error adding sale:', err);
                res.status(500).json({
                    status: 500,
                    error: err instanceof Error ? err.message : "An unknown error occurred",
                });
            }
        });
    }
    /**
     * Delete a sale
     * @param req
     * @param res
     */
    deletedSale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                const removedSale = yield sale_service_1.default.removeSale(id);
                res.status(200).json({
                    status: 200,
                    payload: removedSale,
                });
            }
            catch (err) {
                console.error(err); // Log the error
                res.status(500).json({
                    status: 500,
                    error: err instanceof Error ? err.message : "An unknown error occurred",
                });
            }
        });
    }
    /**
     * Closes off the current sales month/period and sets new targets for the next period.
     * @param req
     * @param res
     */
    closeSalesMonth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentMonth, newTarget, sellerId } = req.body;
            // Input validation
            if (!currentMonth || !sellerId) {
                return res.status(400).json({
                    status: 400,
                    error: "currentMonth and sellerId are required.",
                });
            }
            // Parse currentMonth to Date object
            let parsedMonth;
            try {
                parsedMonth = new Date(currentMonth);
                if (isNaN(parsedMonth.getTime())) {
                    throw new Error("Invalid date format");
                }
            }
            catch (err) {
                return res.status(400).json({
                    status: 400,
                    error: "Invalid date format.",
                });
            }
            try {
                // Close off the current sales period
                const closedSales = yield sale_service_1.default.closeSaleMonth(parsedMonth);
                // Handle newTarget if provided
                let updatedTarget = null;
                if (newTarget) {
                    updatedTarget = yield sale_service_1.default.setNewTarget(sellerId, newTarget);
                }
                res.status(200).json({
                    status: 200,
                    message: "Sales period closed and new target set successfully",
                    payload: {
                        closedSales,
                        updatedTarget,
                    },
                });
            }
            catch (err) {
                console.error('Error closing sales month:', err); // Log the error with context
                res.status(500).json({
                    status: 500,
                    error: err instanceof Error ? err.message : "An unknown error occurred",
                });
            }
        });
    }
}
exports.default = SaleController;
