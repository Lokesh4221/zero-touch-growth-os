export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  expiresAt: Date;
};

export async function getSession(): Promise<SessionPayload | null> {
  // Always active demo session
  return {
    userId: "demo",
    email: "demo@ztgos.com",
    name: "Demo User",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  } as SessionPayload;
}

export async function createSession() {
  // No-op
}

export async function deleteSession() {
  // No-op
}

export async function encrypt() {
  return "";
}

export async function decrypt() {
  return null;
}

