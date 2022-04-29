import { DecodedIdToken } from "firebase-admin/auth";

declare global {
  declare namespace Express {
    export interface Request {
      decodedToken?: DecodedIdToken;
    }
  }
}
