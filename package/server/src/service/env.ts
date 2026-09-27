import * as yup from 'yup';

// ********************************************************************************
// == Schema ======================================================================
const envSchema = yup.object({
 APP_PORT: yup.number().default(5174),
 DATABASE_URL: yup.string().required(),
 // yup's built-in url() test rejects "localhost" URLs (no TLD), so validate with the URL constructor instead
 FRONTEND_URL: yup.string().required().test('is-url', 'FRONTEND_URL must be a valid URL', (value) => {
  try {
   new URL(value ?? '');
   return true;
  } catch {
   return false;
  }
 }),
 JWT_REFRESH_SECRET: yup.string().min(32).required(),
 JWT_SECRET: yup.string().min(32).required(),
 MONGODB_DB_NAME: yup.string().default('relaydesk'),
 MONGODB_URL: yup.string().required(),
 NODE_ENV: yup.string().oneOf(['development', 'production', 'test']).default('development'),
}).required();

const parseEnv = () => envSchema.validateSync(process.env, { abortEarly: false, stripUnknown: true });

// == Export ======================================================================
export const env = parseEnv();
