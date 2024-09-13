import { Request, Response } from "express";
declare class AuthController {
    login(req: Request, res: Response): Promise<{
        status: number;
        payload: string;
        message?: undefined;
    } | {
        status: number;
        message: any;
        payload?: undefined;
    }>;
}
export default AuthController;
