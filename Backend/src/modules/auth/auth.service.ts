import { RegisterInput, LoginInput } from './auth.schemas';
import { findUserByEmail, insertUser } from './auth.repository';
import { hashPassword, verifyPassword } from '../../utils/crypto';
import { signJwt } from '../../utils/jwt';

export async function registerService(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) throw Object.assign(new Error('E-mail já registrado'), { status: 409 });

  const hashed = await hashPassword(input.password);
  const user = await insertUser(input.name, input.email, hashed);
  return user;
}

export async function loginService(input: LoginInput) {
  const user = await findUserByEmail(input.email);
  if (!user) throw Object.assign(new Error('Credenciais inválidas'), { status: 401 });

  const ok = await verifyPassword(input.password, user.password_hash);
  if (!ok) throw Object.assign(new Error('Credenciais inválidas'), { status: 401 });

  const token = await signJwt({ sub: user.id, name: user.name, email: user.email });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}
