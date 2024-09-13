import { PrismaClient } from "@prisma/client";
export default class BaseService {
    protected database: PrismaClient;
    constructor();
}
