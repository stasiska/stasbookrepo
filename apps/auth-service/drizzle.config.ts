import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/drizzle/schema/**.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgresql://root:1234@localhost:5433/stasbook
`,
  },
});