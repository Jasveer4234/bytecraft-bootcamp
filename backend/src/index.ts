import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { seedDefaultAdmin } from './utils/seedAdmin';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Optional initial seed for default admin
    await seedDefaultAdmin();

    // Start Express server
    app.listen(env.PORT, () => {
      console.log(`[Server]: ByteCraft Backend API running at http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error: any) {
    console.error(`[Server Fatal Error]: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export default app;
