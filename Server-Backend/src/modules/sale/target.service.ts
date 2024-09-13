import prisma from "../../utils/client"; 

class TargetService {
  public async updateTarget(sellerId: number, amount: number): Promise<void> {
    try {
      // Update the targetAmount field in the sellers table
      await prisma.seller.update({
        where: {
          id: sellerId,
        },
        data: {
          targetAmount: amount,
        }
      });
    } catch (error) {
      console.error(`Error in updateTarget service: ${error}`);
      throw new Error('Error updating target');
    }
  }
}

export default new TargetService();
