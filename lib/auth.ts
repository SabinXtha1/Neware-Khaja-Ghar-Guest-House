import "server-only";
import { cookies } from "next/headers";
import { encrypt, decrypt, SessionPayload } from "./session";

export type { SessionPayload };
export { decrypt };

export async function createSession(user: {
  _id: string;
  role: "admin" | "customer";
  name: string;
  email: string;
}) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({
    userId: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
