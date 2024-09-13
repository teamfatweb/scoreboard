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
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
        const target = yield client_1.default.target.findFirst({
            where: { sellerId },
            orderBy: { createdAt: 'desc' },
        });
        if (!target) {
            throw new Error('No target found for this seller');
        }
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
        if (currentTotal + amount > target.amount) {
            return {
                status: 'targetExceeded',
                message: 'Sales target for this month has been exceeded. Please set a new target.',
            };
        }
        console.log('Creating sale with data:', {
            amount,
            date,
            sellerId
        });
        const sale = yield client_1.default.sale.create({
            data: {
                amount: amount,
                date: date,
                seller: {
                    connect: {
                        id: sellerId,
                    },
                },
            },
        });
        console.log('Sale created successfully:', sale);
        return {
            status: 'success',
            message: 'Sale added successfully.',
            sale: sale,
        };
    }
    catch (err) {
        console.error(`Error creating sale: ${err}`);
        throw err;
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
const closeSaleMonth = (currentMonth) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59, 999);
        const sales = yield client_1.default.sale.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const salesBySeller = sales.reduce((acc, sale) => {
            if (!acc[sale.sellerId]) {
                acc[sale.sellerId] = 0;
            }
            acc[sale.sellerId] += parseFloat(sale.amount.toFixed(2));
            return acc;
        }, {});
        const currentTargets = yield client_1.default.target.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        for (const target of currentTargets) {
            const totalSales = salesBySeller[target.sellerId] || 0;
            const percentage = calculatePercentage(totalSales, target.amount);
            yield client_1.default.archive.create({
                data: {
                    amount: totalSales,
                    date: startDate,
                    sellerId: target.sellerId,
                    percentage,
                },
            });
            const nextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
            yield client_1.default.target.upsert({
                where: {
                    sellerId_createdAt: {
                        sellerId: target.sellerId,
                        createdAt: nextMonth,
                    },
                },
                update: {
                    amount: target.amount * 1.05,
                },
                create: {
                    sellerId: target.sellerId,
                    amount: target.amount * 1.05,
                    createdAt: nextMonth,
                },
            });
        }
        return {
            status: 'success',
            message: 'Sales month closed and new targets set.',
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error closing sales month: ${error.message}`);
            throw new Error(error.message);
        }
        else {
            console.error('Unexpected error:', error);
            throw new Error("An unknown error occurred");
        }
    }
});
const setNewTarget = (sellerId, newTarget) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof sellerId !== 'number' || isNaN(sellerId) || sellerId <= 0) {
            throw new Error('Invalid seller ID. Must be a positive number.');
        }
        if (typeof newTarget !== 'number' || isNaN(newTarget) || newTarget <= 0) {
            throw new Error('Invalid target value. Must be a positive number.');
        }
        const startDate = new Date();
        startDate.setDate(1);
        const target = yield client_1.default.target.upsert({
            where: {
                sellerId_createdAt: {
                    sellerId: sellerId,
                    createdAt: startDate,
                },
            },
            update: {
                amount: newTarget,
            },
            create: {
                sellerId: sellerId,
                amount: newTarget,
                createdAt: startDate,
            },
        });
        return {
            status: 'success',
            message: 'New target set successfully.',
            target,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error setting new target: ${error.message}`);
            throw new Error(error.message);
        }
        else {
            console.error('Unexpected error:', error);
            throw new Error("An unknown error occurred");
        }
    }
});
function calculatePercentage(totalSales, targetAmount) {
    return (totalSales / targetAmount) * 100;
}
exports.default = {
    createSale,
    listSales,
    removeSale,
    closeSaleMonth,
    setNewTarget,
};
