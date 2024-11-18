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
const dayjs_1 = __importDefault(require("dayjs"));
const client_1 = __importDefault(require("../../utils/client"));
const listSales = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield client_1.default.seller.findMany();
        const sales = users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const sale = yield client_1.default.sale.findMany({
                where: {
                    sellerId: user.id,
                    date: {
                        gte: (0, dayjs_1.default)().startOf("year").toDate(),
                        lte: (0, dayjs_1.default)().endOf("year").toDate(),
                    },
                },
                orderBy: {
                    date: "asc",
                },
                select: {
                    date: true,
                    amount: true,
                    id: true,
                },
            });
            return { user, sale };
        }));
        const payload = yield Promise.all(sales);
        return payload;
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(`Error listing sales: ${err.message}`);
            return false;
        }
        else {
            console.error("An unknown error occurred while listing sales");
            return false;
        }
    }
});
const createSale = (amount, sellerId, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Invalid amount');
        }
        // Define start and end date for the current month
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        // Fetch the seller's current target from the Seller table
        const seller = yield client_1.default.seller.findUnique({
            where: { id: sellerId },
            select: { currentTarget: true }, // Assuming currentTarget is the up-to-date target
        });
        if (!seller || seller.currentTarget === undefined || seller.currentTarget === null) {
            throw new Error('No current target found for this seller');
        }
        // Aggregate total sales for the seller in the current month
        const totalSales = yield client_1.default.sale.aggregate({
            where: {
                sellerId: sellerId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const currentTotal = totalSales._sum.amount || 0;
        // Check if adding the new sale will exceed the seller's current target
        if (currentTotal + amount > seller.currentTarget) {
            return {
                status: 'targetExceeded',
                message: `Sale of ${amount} exceeds the current target of ${seller.currentTarget}.`,
            };
        }
        // Create the sale and store the current target at the time of the sale
        const sale = yield client_1.default.sale.create({
            data: {
                amount: amount,
                date: date,
                sellerId: sellerId,
                currentTargetAmount: seller.currentTarget,
            },
        });
        return {
            status: 'success',
            message: 'Sale added successfully.',
            sale: sale,
        };
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(`Error creating sale: ${err.message}`);
            return {
                status: 'error',
                message: err.message,
            };
        }
        else {
            console.error('An unexpected error occurred', err);
            return {
                status: 'error',
                message: 'An unexpected error occurred.',
            };
        }
    }
});
const removeSale = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sale = yield client_1.default.sale.deleteMany({
            where: {
                id,
            },
        });
        return sale;
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(`Error removing sale: ${err.message}`);
            return err.message;
        }
        else {
            console.error("An unknown error occurred while removing sale");
            return "An unknown error occurred";
        }
    }
});
exports.default = {
    createSale,
    listSales,
    removeSale,
};
