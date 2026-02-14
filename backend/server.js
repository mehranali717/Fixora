import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { env } from "./src/config/env.js";

const bootstrap = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    process.stdout.write(`Fixora API running on port ${env.PORT}\n`);
  });
};

bootstrap().catch((error) => {
  process.stderr.write(`Startup failed: ${error.message}\n`);
  process.exit(1);
});
