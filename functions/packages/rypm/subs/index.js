import crypto from "crypto";

export function main(context) {

	const b64u = b => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
	const b64uToBuf = s => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

	// AES-256-GCM with fixed app key; per-token random IV
	function encryptJSON(obj, key32) {
		const iv = crypto.randomBytes(12);
		const cipher = crypto.createCipheriv("aes-256-gcm", key32, iv, { authTagLength: 16 });
		cipher.setAAD(Buffer.from("pst:v1"));
		const pt = Buffer.from(JSON.stringify(obj));
		const ct = Buffer.concat([cipher.update(pt), cipher.final()]);
		const tag = cipher.getAuthTag();
		return `v1.${b64u(iv)}.${b64u(ct)}.${b64u(tag)}`;
	}
	
	if (!process.env.PST_SECRET) return { statusCode: 500, body: "PST_SECRET missing" };

	const sub = context?.subscription; // accept raw subscription or {subscription:...}

	// minimal validation
	if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
		return { statusCode: 400, body: "Invalid subscription" };
	}

	// include soft expiry (e.g., 180 days)
	const now = Math.floor(Date.now() / 1000);
	const payload = { sub, iat: now, exp: now + 180 * 24 * 3600 };

	const key = b64uToBuf(process.env.PST_SECRET);
	if (key.length !== 32) return { statusCode: 500, body: "PST_SECRET must be 32-byte base64" };

	const token = encryptJSON(payload, key);
	return {
		statusCode: 201,
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ token })
	};
};