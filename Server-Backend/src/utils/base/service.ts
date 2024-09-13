import { PrismaClient } from "@prisma/client";
import prisma from "../client";

export default class BaseService {
  protected database: PrismaClient;

  constructor() {
    this.database = prisma;
  }
}
