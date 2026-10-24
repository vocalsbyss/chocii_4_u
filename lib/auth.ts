import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { CustomerSession } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "chocii_4_u_jwt_fallback_secret_key";
const CUSTOMER_COOKIE_NAME = "cravings_customer_token";
const ADMIN_COOKIE_NAME = "cravings_admin_token";

export function signToken(payload: CustomerSession, expiresIn: string | number = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string): CustomerSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomerSession;
    return decoded;
  } catch {
    return null;
  }
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getAdminSession(): Promise<CustomerSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  const session = verifyToken(token);
  if (session && session.role === "ADMIN") {
    return session;
  }
  return null;
}

export { CUSTOMER_COOKIE_NAME, ADMIN_COOKIE_NAME };
