"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const crypto_1 = __importDefault(require("crypto"));
const web_push_1 = __importDefault(require("web-push"));
web_push_1.default.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:ivucicev@gmail.com', process.env.VAPID_PUBLIC_KEY || 'BEaY_oTCzI5fYJqxhZX27r63lv7Q0kF_oZiQ24c-vPu9zL4867WOEEKvkdTTKciEFJjIpcc0SPuJmtRSmocklzU', process.env.VAPID_PRIVATE_KEY || 'UGPaVtAgoSYoIeZfzwa1fWPWnKHi0zDCRqHFKraWNSI');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
const b64uToBuf = (s) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
const b64u = (b) => Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function decryptPST(token, key32) {
    const [v, ivb64, ctb64, tagb64] = token.split(".");
    if (v !== "v1")
        throw new Error("bad version");
    const iv = b64uToBuf(ivb64), ct = b64uToBuf(ctb64), tag = b64uToBuf(tagb64);
    const decipher = crypto_1.default.createDecipheriv("aes-256-gcm", key32, iv, { authTagLength: 16 });
    decipher.setAAD(Buffer.from("pst:v1"));
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return JSON.parse(pt.toString("utf8"));
}
function encryptJSON(obj, key32) {
    const iv = crypto_1.default.randomBytes(12);
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", key32, iv, { authTagLength: 16 });
    cipher.setAAD(Buffer.from("pst:v1"));
    const pt = Buffer.from(JSON.stringify(obj));
    const ct = Buffer.concat([cipher.update(pt), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `v1.${b64u(iv.toString())}.${b64u(ct.toString())}.${b64u(tag.toString())}`;
}
app.post('/send', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { token, title = "Hi", body: msgBody = "From DO Functions", navigate = "https://app.rypm.app/" } = body || {};
    if (!token)
        return { statusCode: 400, body: "token missing" };
    const key = b64uToBuf(process.env.PST_SECRET || "mKBAvWCvdq+DiqsEK+uDbIUEo9b4b1hHmTmkjxV+BAM=");
    if (key.length !== 32)
        return { statusCode: 500, body: "bad PST_SECRET" };
    let payload;
    try {
        payload = decryptPST(token, key);
    }
    catch (_a) {
        return { statusCode: 400, body: "invalid token" };
    }
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now)
        return { statusCode: 410, body: "expired token" };
    const subscription = payload.sub; // { endpoint, keys:{p256dh,auth} }
    const notif = { title, body: msgBody, navigate, tag: "pst" };
    const json = JSON.stringify({ web_push: 8030, notification: notif });
    try {
        yield web_push_1.default.sendNotification(subscription, json, { TTL: 300 });
        res.status(200).json({ ok: true });
    }
    catch (e) {
        const code = e.statusCode || 500;
        res.status(200).json({ statusCode: code, body: e.message || "send failed" });
    }
}));
app.post('/subscribe', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!process.env.PST_SECRET)
        return { statusCode: 500, body: "PST_SECRET missing" };
    const sub = (_a = req.body) === null || _a === void 0 ? void 0 : _a.subscription; // accept raw subscription or {subscription:...}
    // minimal validation
    if (!(sub === null || sub === void 0 ? void 0 : sub.endpoint) || !((_b = sub === null || sub === void 0 ? void 0 : sub.keys) === null || _b === void 0 ? void 0 : _b.p256dh) || !((_c = sub === null || sub === void 0 ? void 0 : sub.keys) === null || _c === void 0 ? void 0 : _c.auth)) {
        return { statusCode: 400, body: "Invalid subscription" };
    }
    // include soft expiry (e.g., 180 days)
    const now = Math.floor(Date.now() / 1000);
    const payload = { sub, iat: now, exp: now + 180 * 24 * 3600 };
    const key = b64uToBuf(process.env.PST_SECRET);
    if (key.length !== 32)
        return { statusCode: 500, body: "PST_SECRET must be 32-byte base64" };
    const token = encryptJSON(payload, key);
    return {
        statusCode: 201,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token })
    };
}));
app.listen(PORT, () => {
    console.log(`Server is running at :${PORT}`);
});
