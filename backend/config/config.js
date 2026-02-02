export const config = {
  get mongoUri() {
    return process.env.MONGO_URI || "mongodb://localhost:27017/nova-cms";
  },
  get port() {
    return process.env.PORT || 5000;
  },
  get jwtSecret() {
    return process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
  },
  get jwtExpiresIn() {
    return process.env.JWT_EXPIRES_IN || "1d";
  },
  get nodeEnv() {
    return process.env.NODE_ENV || "development";
  }
};
