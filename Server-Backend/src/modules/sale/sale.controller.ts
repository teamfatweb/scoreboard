import { Request, Response } from "express";
import SaleService from "./sale.service";
import prisma from "../../utils/client";

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

  public async updateTarget(req: Request, res: Response) {
    const { sellerId, targetAmount } = req.body;

    // Input validation
    if (!sellerId || typeof sellerId !== 'number' || isNaN(sellerId) || 
        !targetAmount || typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid input data',
      });
    }

    try {
      await prisma.seller.update({
        where: { id: sellerId },
        data: { currentTarget: targetAmount },
      });

      res.status(200).json({
        status: 'success',
        message: 'Target amount updated successfully.',
      });
    } catch (err) {
      console.error('Error updating target:', err);
      res.status(500).json({
        status: 'error',
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  }
}  

export default SaleController;
