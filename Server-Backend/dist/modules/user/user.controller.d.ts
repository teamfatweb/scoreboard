import { Request, Response } from "express";
declare class UserController {
    /**
     *
     * @param req
     * @param res
     */
    listUser(): Promise<{
        status: number;
        payload: any;
        message?: undefined;
    } | {
        status: number;
        message: any;
        payload?: undefined;
    }>;
    /**
     *
     * @param req
     * @param res
     */
    createUser(req: Request, res: Response): Promise<{
        status: number;
        payload: any;
        message?: undefined;
    } | {
        status: number;
        message: any;
        payload?: undefined;
    }>;
    updateUser(req: Request, res: Response): Promise<{
        stauts: number;
        payload: any;
        status?: undefined;
        message?: undefined;
    } | {
        status: number;
        message: any;
        stauts?: undefined;
        payload?: undefined;
    }>;
    deletedUser(req: Request, res: Response): Promise<{
        status: number;
        payload: any;
        message?: undefined;
    } | {
        status: number;
        message: any;
        payload?: undefined;
    }>;
}
export default UserController;
