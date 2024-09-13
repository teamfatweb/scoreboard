import { Request, Response, NextFunction } from "express";
export default function validateSchema(schema: any, mapProperty: Function): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
