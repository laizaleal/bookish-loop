import 'dotenv/config';

const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3333),
  dbUrl: process.env.DATABASE_URL!,
  corsOrigin: process.env.FRONTEND_ORIGIN ?? '*',
  jwt: {
    secret: process.env.JWT_SECRET!,
    iss: process.env.JWT_ISS ?? 'backend.standard',
    aud: process.env.JWT_AUD ?? 'backend.clients',
    expiresIn: '1d'
  }
};

if (!env.dbUrl) throw new Error('DATABASE_URL ausente');
if (!env.jwt.secret) throw new Error('JWT_SECRET ausente');

export default env;
