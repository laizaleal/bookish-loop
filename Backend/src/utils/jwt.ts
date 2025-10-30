import * as jose from 'jose';
import env from '../config/env';

const key = new TextEncoder().encode(env.jwt.secret);

export async function signJwt(payload: Record<string, unknown>) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(env.jwt.iss)
    .setAudience(env.jwt.aud)
    .setExpirationTime(env.jwt.expiresIn)
    .sign(key);
}

export async function verifyJwt(token: string) {
  const { payload } = await jose.jwtVerify(token, key, {
    issuer: env.jwt.iss,
    audience: env.jwt.aud
  });
  return payload;
}
