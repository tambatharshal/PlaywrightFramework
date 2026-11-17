import * as fs from 'fs';
import * as path from 'path';

export type EnvironmentName = 'qa' | 'staging' | 'prod' | 'local';

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface TimeoutConfig {
  test: number;
  expect: number;
  action: number;
  navigation: number;
}

export interface EnvConfig {
  name: EnvironmentName;
  baseUrl: string;
  apiBaseUrl: string;
  timeouts: TimeoutConfig;
  db: DbConfig;
  features: {
    headless: boolean;
    recordVideo: boolean;
  };
}

export interface UserCredentials {
  username: string;
  password: string;
  role: string;
  email?: string;
}

export interface UsersFile {
  users: Record<string, UserCredentials>;
}

/**
 * Resolve ENV from process (default: qa).
 * Usage: ENV=staging npm run test
 */
export function getActiveEnv(): EnvironmentName {
  const env = (process.env.ENV || 'qa').toLowerCase() as EnvironmentName;
  const allowed: EnvironmentName[] = ['qa', 'staging', 'prod', 'local'];
  if (!allowed.includes(env)) {
    throw new Error(`Invalid ENV="${env}". Allowed: ${allowed.join(', ')}`);
  }
  return env;
}

function loadJson<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

/**
 * Loads config/<env>.env.json and merges optional .env DB overrides.
 *
 * HOW TO ADD A NEW ENVIRONMENT
 * 1. Copy config/qa.env.json → config/<name>.env.json and update URLs/timeouts/db
 * 2. Copy data/users/qa.users.json → data/users/<name>.users.json and update users
 * 3. Add "test:<name>": "cross-env ENV=<name> npx playwright test" in package.json
 * 4. Run: ENV=<name> npm run test  (or npm run test:<name>)
 */
export function getEnvConfig(): EnvConfig {
  const name = getActiveEnv();
  const filePath = path.join(__dirname, `${name}.env.json`);
  const config = loadJson<EnvConfig>(filePath);

  // Optional runtime overrides from .env / CI secrets
  config.db = {
    ...config.db,
    host: process.env.DB_HOST || config.db.host,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : config.db.port,
    user: process.env.DB_USER || config.db.user,
    password: process.env.DB_PASSWORD || config.db.password,
    database: process.env.DB_NAME || config.db.database,
  };

  return { ...config, name };
}

/**
 * Loads data/users/<env>.users.json
 * Access: getUsers().users.standard  or  getUser('locked')
 */
export function getUsers(): UsersFile {
  const name = getActiveEnv();
  const filePath = path.join(__dirname, '..', 'data', 'users', `${name}.users.json`);
  return loadJson<UsersFile>(filePath);
}

export function getUser(key: string): UserCredentials {
  const users = getUsers().users;
  const user = users[key];
  if (!user) {
    throw new Error(`User key "${key}" not found for ENV=${getActiveEnv()}. Available: ${Object.keys(users).join(', ')}`);
  }
  return user;
}
