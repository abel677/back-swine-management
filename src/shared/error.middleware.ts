import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(`[ERROR] ${req.method} ${req.url}`);
    const status = err.status || 500;

    console.log(err);
    

    res.status(status).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
}
