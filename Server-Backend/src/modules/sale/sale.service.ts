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

    // Define start and end date for the current month
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    // Fetch the seller's current target from the Seller table
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
      select: { currentTarget: true }, // Assuming currentTarget is the up-to-date target
    });

    if (!seller || seller.currentTarget === undefined || seller.currentTarget === null) {
      throw new Error('No current target found for this seller');
    }

    // Aggregate total sales for the seller in the current month
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

    // Check if adding the new sale will exceed the seller's current target
    if (currentTotal + amount > seller.currentTarget) {
      return {
        status: 'targetExceeded',
        message: `Sale of ${amount} exceeds the current target of ${seller.currentTarget}.`,
      };
    }

    // Create the sale and store the current target at the time of the sale
    const sale = await prisma.sale.create({
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

  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error creating sale: ${err.message}`);
      return {
        status: 'error',
        message: err.message,
      };
    } else {
      console.error('An unexpected error occurred', err);
      return {
        status: 'error',
        message: 'An unexpected error occurred.',
      };
    }
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



export default {
  createSale,
  listSales,
  removeSale,
};
