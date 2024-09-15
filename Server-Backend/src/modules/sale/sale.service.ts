import dayjs from "dayjs";
import prisma from "../../utils/client";
import targetService from "./target.service";

interface Sale {
  amount: number;
  date: Date;
  sellerId: number;
}

interface Target {
  sellerId: number;
  amount: number;
  createdAt: Date;
}

interface User {
  id: number;
}

const listSales = async () => {
  try {
    const users = await prisma.seller.findMany();

    const sales = users.map(async (user: User) => {
      const sale = await prisma.sale.findMany({
        where: {
          sellerId: user.id,
          date: {
            gte: dayjs().startOf("year").toDate(),
            lte: dayjs().endOf("year").toDate(),
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
    });

    const payload = await Promise.all(sales);

    return payload;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error listing sales: ${err.message}`);
      return false;
    } else {
      console.error("An unknown error occurred while listing sales");
      return false;
    }
  }
};

const createSale = async (amount: number, sellerId: number, date: Date) => {
  try {
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    const target = await prisma.target.findFirst({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });

    if (!target) {
      throw new Error('No target found for this seller');
    }

    const totalSales = await prisma.sale.aggregate({
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

    const sale = await prisma.sale.create({
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

  } catch (err) {
    console.error(`Error creating sale: ${err}`);
    throw err;
  }
};



const removeSale = async (id: number) => {
  try {
    const sale = await prisma.sale.deleteMany({
      where: {
        id,
      },
    });
    return sale;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error removing sale: ${err.message}`);
      return err.message;
    } else {
      console.error("An unknown error occurred while removing sale");
      return "An unknown error occurred";
    }
  }
};

const closeSaleMonth = async (currentMonth: Date) => {
  try {
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59, 999);

    const sales = await prisma.sale.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const salesBySeller = sales.reduce((acc: Record<number, number>, sale: { sellerId: number; amount: number }) => {
      if (!acc[sale.sellerId]) {
        acc[sale.sellerId] = 0;
      }
      acc[sale.sellerId] += parseFloat(sale.amount.toFixed(2));
      return acc;
    }, {} as Record<number, number>);
    
    const currentTargets = await prisma.target.findMany({
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

      await prisma.archive.create({
        data: {
          amount: totalSales,
          date: startDate,
          sellerId: target.sellerId,
          percentage,
        },
      });

      const nextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

      await prisma.target.upsert({
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error closing sales month: ${error.message}`);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error("An unknown error occurred");
    }
  }
};

const setNewTarget = async (sellerId: number, newTarget: number) => {
  try {
    if (typeof sellerId !== 'number' || isNaN(sellerId) || sellerId <= 0) {
      throw new Error('Invalid seller ID. Must be a positive number.');
    }
    if (typeof newTarget !== 'number' || isNaN(newTarget) || newTarget <= 0) {
      throw new Error('Invalid target value. Must be a positive number.');
    }

    const startDate = new Date();
    startDate.setDate(1);

    const target = await prisma.target.upsert({
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error setting new target: ${error.message}`);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error:', error);
      throw new Error("An unknown error occurred");
    }
  }
};

function calculatePercentage(totalSales: number, targetAmount: number): number {
  return (totalSales / targetAmount) * 100;
}

export default {
  createSale,
  listSales,
  removeSale,
  closeSaleMonth,
  setNewTarget,
};
