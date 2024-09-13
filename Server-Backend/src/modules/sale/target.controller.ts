import { Request, Response } from 'express';
import TargetService from './target.service'; // Import your service

class TargetController {

  public async updateTarget(req: Request, res: Response): Promise<void> {
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

      await TargetService.updateTarget(parsedSellerId, parsedAmount);
      res.status(200).json({ message: 'Target updated successfully' });
    } catch (error) {
      console.error(`Error in updateTarget: ${error}`);
      res.status(500).json({ message: 'Error updating target. Please try again later.' });
    }
  }
}

export default TargetController;
