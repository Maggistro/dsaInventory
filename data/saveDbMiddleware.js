import { saveDb } from "./saveDb.js";

export const saveDbMiddleware = (req, res, next) => {
    req.on("end", saveDb);
    next();
}
