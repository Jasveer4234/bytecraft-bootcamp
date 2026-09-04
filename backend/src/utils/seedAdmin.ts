import { User } from '../models/User';
import { hashPassword } from './password';
import { env } from '../config/env';

export const seedDefaultAdmin = async () => {
  try {
    const isProduction = env.NODE_ENV === 'production';

    // In production, do not create a default admin with hardcoded credentials
    if (isProduction && (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD)) {
      return;
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const email = (isProduction ? env.ADMIN_EMAIL : (env.ADMIN_EMAIL || 'admin@bytecraft.dev')).toLowerCase().trim();
      const password = isProduction ? env.ADMIN_PASSWORD : (env.ADMIN_PASSWORD || 'AdminPass123!');
      const defaultName = 'ByteCraft Admin';

      const passwordHash = await hashPassword(password);

      await User.create({
        name: defaultName,
        email,
        passwordHash,
        role: 'admin',
      });

      console.log(`[Seed]: Created admin user (${email})`);
    }
  } catch (error: any) {
    console.error(`[Seed Warning]: Failed to seed admin user — ${error.message}`);
  }
};
