import jwt from 'jsonwebtoken';

export const JWTSECRETKEY = 'vueappjwtkey';

export function generateToken(secKey, data, expire) {
  return jwt.sign(data, secKey, { expiresIn: expire });
}

export async function verifyToken(secKey, token) {
  try {
    const decoded = await jwt.verify(token, secKey);
    return decoded;
  } catch (error) {
    throw error;
  }
}
