import { getStore } from "@netlify/blobs";

const store = getStore("presence");
const TTL_MS = 45000;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });

async function countActiveVisitors() {
  const now = Date.now();
  const { blobs } = await store.list();
  let active = 0;

  for (const blob of blobs) {
    const entry = await store.getMetadata(blob.key);
    const seenAt = entry?.metadata?.seenAt;

    if (typeof seenAt !== "number" || now - seenAt > TTL_MS) {
      await store.delete(blob.key);
      continue;
    }

    active += 1;
  }

  return active;
}

export default async (request) => {
  if (request.method !== "POST" && request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (request.method === "POST") {
    const body = await request.json().catch(() => null);
    const sessionId = body?.sessionId;

    if (typeof sessionId !== "string" || sessionId.length < 8) {
      return json({ error: "Invalid session" }, 400);
    }

    await store.setJSON(sessionId, { active: true }, {
      metadata: {
        seenAt: Date.now()
      }
    });
  }

  const online = await countActiveVisitors();
  return json({ online });
};
