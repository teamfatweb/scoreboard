import { Request, Response } from "express";
import logger from "../utils/logger";

export default function actionHandler(action: Function) {
  return async (req: Request, res: Response) => {
    return action(req, res)
      .then((rlt: any) => sendResponseSuccess(res, rlt))
      .catch((err: any) => sendResponseFail(res, err));
  };
}

function sendResponseSuccess(
  res: Response,
  result: { status?: number | boolean; payload: object | boolean }
) {
  if (!result) return res.status(200);

  const { status = false, payload = false } = result;

  if (status && typeof status === "number" && payload)
    return res.status(status).json(payload);
  if (status && typeof status === "number" && !payload)
    return res.sendStatus(status);
  if (!status && payload) return res.status(200).json(payload);
  else return res.status(200).json(result);
}

function sendResponseFail(res: Response, error: any) {
  logger.error(error);
  res.status(error.status || 400).json({ error: error.message });
}
