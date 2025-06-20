import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  return token || null
}

export function getUserFromToken(token: string) {
  const decoded = verifyToken(token)
  if (!decoded || typeof decoded !== "object") {
    return null
  }
  return decoded as any
}
