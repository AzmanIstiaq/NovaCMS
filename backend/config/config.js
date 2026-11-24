export const config = {
  get mongoUri() {
    return process.env.MONGO_URI || "mongodb://localhost:27017/nova-cms";
  },
  get port() {
    return process.env.PORT || 5000;
  },
  get jwtSecret() {
    return process.env.JWT_SECRET;
  },
  get jwtExpiresIn() {
    return process.env.JWT_EXPIRES_IN || "1h";
  },
  get nodeEnv() {
    return process.env.NODE_ENV || "development";
  },
  get corsOrigin() {
    return process.env.CORS_ORIGIN || "http://localhost:3000";
  },
};

export const validateConfig = () => {
  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be set and contain at least 32 characters");
  }
};
