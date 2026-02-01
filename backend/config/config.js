export const config = {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  nodeEnv: process.env.NODE_ENV || "development",
};
