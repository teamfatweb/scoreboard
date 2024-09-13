import { Request, Response } from "express";
export default function actionHandler(action: Function): (req: Request, res: Response) => Promise<any>;
