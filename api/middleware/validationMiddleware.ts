import { Request, Response, NextFunction } from "express";
import { AnySchema, ValidationError } from "yup";

const validate = (schema: AnySchema) => (req: Request, res: Response, next: NextFunction) => {
  schema.validate(req.body, { abortEarly: false })
  .then(() => next())
  .catch((err: ValidationError) => {
    const errorMessages = err.inner.map((e) => e.message); // Collect error messages in an array
    res.status(400).json({ success: false, message: errorMessages });
  });
};

export default validate;
