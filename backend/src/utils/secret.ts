// auth.ts
import { sign, verify } from 'jsonwebtoken';

// Secret keys for tokens (replace with your actual secrets)
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret';

export const createSecretToken = (userId: string): string => {
  return sign({ sub: userId }, accessTokenSecret, { expiresIn: '15m' });
};

export const createRefreshToken = (userId: string): string => {
  return sign({ sub: userId }, refreshTokenSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string, secret: string): any => {
  try {
    return verify(token, secret);
  } catch (error) {
    return null;
  }
};