import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    // DEBUG: always log the decision while debugging
    console.log("Arcjet decision:", JSON.stringify(decision, null, 2));

    // safe checks (avoid crashes if reason is undefined)
    const denied = typeof decision?.isDenied === "function" ? decision.isDenied() : !!decision?.denied;
    const reason = decision?.reason || {};
    const rateLimit = typeof reason?.isRateLimit === "function" ? reason.isRateLimit() : String(reason || "").toLowerCase().includes("rate");
    const bot = typeof reason?.isBot === "function" ? reason.isBot() : String(reason || "").toLowerCase().includes("bot");
    const spoofed = Array.isArray(decision?.results) && decision.results.some(isSpoofedBot);

    if (denied) {
      if (rateLimit) return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
      return res.status(403).json({ message: "Access denied by security policy." });
    }

    if (bot || spoofed) {
      return res.status(403).json({ message: "Bot access denied." });
    }

    return next();
  } catch (error) {
    console.error("Arcjet Protection Error:", error);
    return next(); // dev: fail-open. In prod you might return 500 or 403.
  }
};
