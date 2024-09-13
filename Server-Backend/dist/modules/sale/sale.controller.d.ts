import { Request, Response } from "express";
declare class SaleController {
    /**
     *
     * @param req
     * @param res
     */
    listSales(): Promise<{
        status: number;
        payload: boolean | {
            user: {
                id: number;
                name: string;
                email: string;
                password: string;
                role: string;
                createdAt: Date;
                targetAmount: number;
            };
            sale: {
                date: Date;
                amount: number;
            }[];
        }[];
        error?: undefined;
    } | {
        status: number;
        error: any;
        payload?: undefined;
    }>;
    /**
     *
     * @param req
     * @param res
     */
    addSale(req: Request, res: Response): Promise<{
        status: number;
        payload: any;
        error?: undefined;
    } | {
        status: number;
        error: any;
        payload?: undefined;
    }>;

    
}
export default SaleController;
