import crypto from "crypto";
import WebPush from "web-push";

const b64uToBuf = s => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

function decryptPST(token, key32) {
	// v1.<iv>.<ct>.<tag>
	const [v, ivb64, ctb64, tagb64] = token.split(".");
	if (v !== "v1") throw new Error("bad version");
	const iv = b64uToBuf(ivb64), ct = b64uToBuf(ctb64), tag = b64uToBuf(tagb64);

	const decipher = crypto.createDecipheriv("aes-256-gcm", key32, iv, { authTagLength: 16 });
	decipher.setAAD(Buffer.from("pst:v1"));
	decipher.setAuthTag(tag);

	const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
	return JSON.parse(pt.toString("utf8"));
}

WebPush.setVapidDetails(
	process.env.VAPID_SUBJECT,
	process.env.VAPID_PUBLIC_KEY,
	process.env.VAPID_PRIVATE_KEY
);

export async function main(context) {

	const body = context;
	const { token, title = "Hi", body: msgBody = "From DO Functions", navigate = "https://app.rypm.app/" } = body || {};
	if (!token) return { statusCode: 400, body: "token missing" };

	const key = b64uToBuf(process.env.PST_SECRET || "");
	if (key.length !== 32) return { statusCode: 500, body: "bad PST_SECRET" };

	let payload;
	try {
		payload = decryptPST(token, key);
	} catch {
		return { statusCode: 400, body: "invalid token" };
	}
	const now = Math.floor(Date.now() / 1000);
	if (payload.exp && payload.exp < now) return { statusCode: 410, body: "expired token" };

	const subscription = payload.sub; // { endpoint, keys:{p256dh,auth} }

	// Declarative-first payload; SW-compatible fallback
	const notif = { title, body: msgBody, navigate, tag: "pst" };
	const json = JSON.stringify({ web_push: 8030, notification: notif });

	try {
		await WebPush.sendNotification(subscription, json, { TTL: 300 });
		return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok: true }) };
	} catch (e) {
		const code = e.statusCode || 500;
		return { statusCode: code, body: e.message || "send failed" };
	}
}