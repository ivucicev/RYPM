import express, { Request, Response } from 'express';
import crypto from "crypto";
import WebPush from "web-push";

WebPush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:ivucicev@gmail.com' as string,
    process.env.VAPID_PUBLIC_KEY || 'BEaY_oTCzI5fYJqxhZX27r63lv7Q0kF_oZiQ24c-vPu9zL4867WOEEKvkdTTKciEFJjIpcc0SPuJmtRSmocklzU' as string,
    process.env.VAPID_PRIVATE_KEY || 'UGPaVtAgoSYoIeZfzwa1fWPWnKHi0zDCRqHFKraWNSI' as string
);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const b64uToBuf = (s: string) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
const b64u = (b: string) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function decryptPST(token: string, key32: Buffer<ArrayBuffer>) {

    const [v, ivb64, ctb64, tagb64] = token.split(".");
    if (v !== "v1") throw new Error("bad version");
    const iv = b64uToBuf(ivb64), ct = b64uToBuf(ctb64), tag = b64uToBuf(tagb64);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key32, iv, { authTagLength: 16 });
    decipher.setAAD(Buffer.from("pst:v1"));
    decipher.setAuthTag(tag);

    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return JSON.parse(pt.toString("utf8"));
}

function encryptJSON(obj: object, key32: crypto.CipherKey) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key32, iv, { authTagLength: 16 });
    cipher.setAAD(Buffer.from("pst:v1"));
    const pt = Buffer.from(JSON.stringify(obj));
    const ct = Buffer.concat([cipher.update(pt), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `v1.${b64u(iv.toString())}.${b64u(ct.toString())}.${b64u(tag.toString())}`;
}

app.get('/health-check', async (req: Request, res: Response) => {
    res.status(200).json({ healthy: true, ok: true });
});

app.post('/send', async (req: Request, res: Response) => {

    console.log("SENDING", req.body);

    const body = req.body;
    const { token, title = "Hi", body: msgBody = "From DO Functions", navigate = "https://app.rypm.app/" } = body || {};
    if (!token) return { statusCode: 400, body: "token missing" };

    const key = b64uToBuf(process.env.PST_SECRET || "mKBAvWCvdq+DiqsEK+uDbIUEo9b4b1hHmTmkjxV+BAM=");
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

    const notif = { title, body: msgBody, navigate, tag: "pst" };
    const json = JSON.stringify({ web_push: 8030, notification: notif });

    try {
        await WebPush.sendNotification(subscription, json, { TTL: 300 });
        res.status(200).json({ ok: true });
    } catch (e: any) {
        const code = e.statusCode || 500;
        res.status(200).json({ statusCode: code, body: e.message || "send failed" });
    }
});

app.post('/subscribe', async (req: Request, res: Response) => {

    console.log("SUBSCRIBING", req.body);

    if (!process.env.PST_SECRET) return { statusCode: 500, body: "PST_SECRET missing" };

    const sub = req.body?.subscription; // accept raw subscription or {subscription:...}

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

})

app.listen(PORT, () => {
    console.log(`Server is running at :${PORT}`);
});