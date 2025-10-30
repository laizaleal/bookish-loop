import env from './config/env';
import { buildApp } from './app';

const app = buildApp();

app.listen({ port: env.port, host: '0.0.0.0' })
  .then(() => console.log(`[HTTP] up on :${env.port}`))
  .catch((e) => { console.error(e); process.exit(1); });
