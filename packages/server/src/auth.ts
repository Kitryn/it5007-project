import { Request, Response, NextFunction } from "express";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";

const ADMIN_UID = new Set(["TPNUyxJKKmS1kWH5jcrduUdTpXi1", "TxCnMJph0PYWSLLSR7nNBTrxZCj1"]);

export const isLoggedInMiddleware = async function (req: Request, res: Response, next: NextFunction) {
  const jwtValue = req.headers.authorization?.substring(7);
  if (jwtValue == null) {
    res.status(401).send("Unauthorized");
    return;
  }

  const decodedToken = await getAuth().verifyIdToken(jwtValue);
  req.decodedToken = decodedToken;
  next();
};

export const isAdminMiddleware = function (req: Request, res: Response, next: NextFunction) {
  if (!ADMIN_UID.has(req.decodedToken?.uid ?? "")) {
    res.status(403).send("Forbidden");
    return;
  }

  next();
};
