import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export default function validateSchema(schema: any, mapProperty: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    const property = mapProperty ? mapProperty(req) : req.body;
    const { error } = schema.validate(property);

    if (error === null) return next();
    else {
      const { details } = error;
      const message = details.map((i: any) => i.message).join(",");

      return res.status(422).json({ error: message });
    }
  };
}
