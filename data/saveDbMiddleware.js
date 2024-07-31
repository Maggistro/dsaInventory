import { saveDb } from './saveDb.js'

export const saveDbMiddleware = (req, res, next) => {
    res.on('finish', saveDb)
    next()
}
