import { Request, Response } from "express";
import SaleService from "./sale.service";

class SaleController {
  /**
   * List all sales
   * @param req
   * @param res
   */
  public async listSales(req: Request, res: Response) {
    try {
      const sales = await SaleService.listSales();
      res.status(200).json(sales); // Changed to 200 OK
    } catch (err) {
      console.error(err); // Log the error
      res.status(500).json({
        status: 500,
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }

  /**
   * Add a new sale
   * @param req
   * @param res
   */
  public async addSale(req: Request, res: Response) {
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

        const newSale = await SaleService.createSale(
            formattedAmount,
            Number(userId),
            new Date() 
        );

        res.status(201).json({ 
            status: 201,
            payload: newSale,
        });
    } catch (err) {
        console.error('Error adding sale:', err); 
        res.status(500).json({
            status: 500,
            error: err instanceof Error ? err.message : "An unknown error occurred",
        });
    }
}


  /**
   * Delete a sale
   * @param req
   * @param res
   */
  public async deletedSale(req: Request, res: Response) {
    const { id } = req.body;
    try {
      const removedSale = await SaleService.removeSale(id);
      res.status(200).json({
        status: 200,
        payload: removedSale,
      });
    } catch (err) {
      console.error(err); // Log the error
      res.status(500).json({
        status: 500,
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }

  /**
   * Closes off the current sales month/period and sets new targets for the next period.
   * @param req
   * @param res
   */
  public async closeSalesMonth(req: Request, res: Response) {
    const { currentMonth, newTarget, sellerId } = req.body;
  
    // Input validation
    if (!currentMonth || !sellerId) {
      return res.status(400).json({
        status: 400,
        error: "currentMonth and sellerId are required.",
      });
    }
  
    // Parse currentMonth to Date object
    let parsedMonth: Date;
    try {
      parsedMonth = new Date(currentMonth);
      if (isNaN(parsedMonth.getTime())) {
        throw new Error("Invalid date format");
      }
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: "Invalid date format.",
      });
    }
  
    try {
      // Close off the current sales period
      const closedSales = await SaleService.closeSaleMonth(parsedMonth);
  
      // Handle newTarget if provided
      let updatedTarget: any = null;
      if (newTarget) {
        updatedTarget = await SaleService.setNewTarget(sellerId, newTarget);
      }
  
      res.status(200).json({
        status: 200,
        message: "Sales period closed and new target set successfully",
        payload: {
          closedSales,
          updatedTarget,
        },
      });
    } catch (err) {
      console.error('Error closing sales month:', err); // Log the error with context
      res.status(500).json({
        status: 500,
        error: err instanceof Error ? err.message : "An unknown error occurred",
      });
    }
  }
}  


export default SaleController;
