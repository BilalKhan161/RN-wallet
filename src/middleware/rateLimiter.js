import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      console.warn("⚠️  Rate limit exceeded for a request.");
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }

    console.log("✅ Request allowed by rate limiter.");
    next();
  } catch (error) {
    console.error("❌ Rate limiter failed to execute properly:", error);
    next(error);
  }
};

export default ratelimiter;
