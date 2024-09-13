import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY as string;

const generateAccessToken = (email: string, role: string) => {
  return jwt.sign({ email, role }, SECRET_KEY);
};

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

const validatePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export default {
  generateAccessToken,
  hashPassword,
  validatePassword,
};
