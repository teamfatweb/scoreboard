import { NextFunction, Request, Response } from "express";
declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export { authenticateToken };
