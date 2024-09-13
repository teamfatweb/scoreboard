"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
function actionHandler(action) {
    return (req, res) => __awaiter(this, void 0, void 0, function* () {
        return action(req, res)
            .then((rlt) => sendResponseSuccess(res, rlt))
            .catch((err) => sendResponseFail(res, err));
    });
}
exports.default = actionHandler;
function sendResponseSuccess(res, result) {
    if (!result)
        return res.status(200);
    const { status = false, payload = false } = result;
    if (status && typeof status === "number" && payload)
        return res.status(status).json(payload);
    if (status && typeof status === "number" && !payload)
        return res.sendStatus(status);
    if (!status && payload)
        return res.status(200).json(payload);
    else
        return res.status(200).json(result);
}
function sendResponseFail(res, error) {
    logger_1.default.error(error);
    res.status(error.status || 400).json({ error: error.message });
}
