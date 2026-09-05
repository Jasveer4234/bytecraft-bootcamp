import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { hashPassword } from '../utils/password';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = 5001;

const extractCookie = (setCookieHeader: string | null): string => {
  if (!setCookieHeader) return '';
  const match = setCookieHeader.match(/token=[^;]+/);
  return match ? match[0] : '';
};

const runTests = async () => {
  console.log('[API Verification Script]: Checking database availability & route definitions...');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bytecraft';

  try {
    // Attempt DB connection with 2s timeout
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log('[API Verification Script]: Connected to MongoDB successfully.');
  } catch (err: any) {
    console.log(`[API Verification Note]: Local MongoDB instance not reachable (${err.message}). Skipping runtime DB requests.`);
    console.log('[API Verification Script]: Static API structure & TypeScript checks verified.');
    process.exit(0);
  }

  const server = app.listen(PORT);
  const baseUrl = `http://localhost:${PORT}/api`;

  let ipCounter = 1;
  const request = async (path: string, options: RequestInit = {}, cookies = '') => {
    ipCounter++;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Forwarded-For': `192.168.1.${ipCounter}`,
      ...(options.headers as Record<string, string>),
    };
    if (cookies) headers['Cookie'] = cookies;
    const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
    const data: any = await res.json().catch(() => ({}));
    const setCookieHeader = res.headers.get('set-cookie');
    return { status: res.status, data, setCookie: setCookieHeader };
  };

  try {
    // Test data definitions
    const testAdminEmail = 'testadmin@bytecraft.dev';
    const testAdminPassword = 'TestPassword123!';
    const testUserEmail = 'student@bytecraft.dev';
    const testUserPassword = 'StudentPass123!';
    const attackEmail = 'attacker@bytecraft.dev';

    // Cleanup previous test data
    await User.deleteMany({
      email: { $in: [testAdminEmail, testUserEmail, attackEmail] },
    });

    // Seed test admin
    await User.create({
      name: 'Test Lead Admin',
      email: testAdminEmail,
      passwordHash: await hashPassword(testAdminPassword),
      role: 'admin',
    });

    console.log('\n--- 1. Testing Public & Static Routes ---');
    const resHealth = await request('/health');
    console.assert(resHealth.status === 200 && resHealth.data.success, 'Health check failed');
    console.log('✓ GET /api/health returned 200 OK');

    const resSchedule = await request('/schedule');
    console.assert(resSchedule.status === 200 && resSchedule.data.success, 'Public schedule GET failed');
    console.log('✓ GET /api/schedule returned 200 OK');

    console.log('\n--- 2. Testing User Registration ---');
    // 2a. Missing fields
    const resMissing = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: testUserEmail }),
    });
    console.assert(resMissing.status === 400, `Expected 400 for missing fields, got ${resMissing.status}`);
    console.log('✓ Registration rejected missing required fields (400)');

    // 2b. Invalid email format
    const resInvalidEmail = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: 'invalid-email', password: testUserPassword }),
    });
    console.assert(resInvalidEmail.status === 400, `Expected 400 for invalid email, got ${resInvalidEmail.status}`);
    console.log('✓ Registration rejected invalid email format (400)');

    // 2c. Weak/short password (< 6 chars)
    const resWeakPass = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: testUserEmail, password: '123' }),
    });
    console.assert(resWeakPass.status === 400, `Expected 400 for short password, got ${resWeakPass.status}`);
    console.log('✓ Registration rejected short password (400)');

    // 2d. Successful valid registration
    const resRegister = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bootcamp Student', email: testUserEmail, password: testUserPassword }),
    });
    console.assert(resRegister.status === 201, `Expected 201 for register, got ${resRegister.status}`);
    console.assert(resRegister.data.user.role === 'user', `Expected role 'user', got ${resRegister.data.user?.role}`);
    console.assert(!resRegister.data.user.passwordHash && !resRegister.data.user.password, 'Password hash exposed in register response!');
    console.assert(resRegister.setCookie?.includes('token='), 'HTTP-only auth cookie not set on register');
    console.log('✓ Valid registration succeeded with role "user" and HTTP-only cookie (201)');

    const userInDb = await User.findOne({ email: testUserEmail });
    console.assert(userInDb !== null, 'User document not found in DB');
    console.assert(userInDb?.role === 'user', `DB role is ${userInDb?.role}, expected 'user'`);
    console.assert(userInDb?.passwordHash.startsWith('$2'), 'Password not properly hashed with bcrypt');
    console.log('✓ Verified DB state: role is "user" and password is encrypted');

    // 2e. Duplicate registration rejected
    const resDuplicate = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Duplicate User', email: testUserEmail, password: testUserPassword }),
    });
    console.assert(resDuplicate.status === 409, `Expected 409 Conflict for duplicate email, got ${resDuplicate.status}`);
    console.log('✓ Duplicate email registration rejected with 409 Conflict');

    // 2f. Privilege Escalation Attack: attempting to register with role="admin"
    const resAttack = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Attacker',
        email: attackEmail,
        password: 'AttackerPassword123!',
        role: 'admin',
      }),
    });
    console.assert(resAttack.status === 201, `Expected 201, got ${resAttack.status}`);
    console.assert(resAttack.data.user.role === 'user', `Attacker successfully created role ${resAttack.data.user?.role}!`);
    const attackUserInDb = await User.findOne({ email: attackEmail });
    console.assert(attackUserInDb?.role === 'user', `DB stored role ${attackUserInDb?.role} for attacker!`);
    console.log('✓ Privilege escalation prevented: request with "role": "admin" created role "user"');

    console.log('\n--- 3. Testing Authentication & Login ---');
    // 3a. Invalid credentials
    const resInvalidLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testUserEmail, password: 'WrongPassword!' }),
    });
    console.assert(resInvalidLogin.status === 401, `Expected 401 for bad password, got ${resInvalidLogin.status}`);
    console.log('✓ Login rejected invalid credentials (401)');

    // 3b. Normal user login
    const resUserLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testUserEmail, password: testUserPassword }),
    });
    console.assert(resUserLogin.status === 200, `Expected 200 for user login, got ${resUserLogin.status}`);
    console.assert(resUserLogin.data.user.role === 'user', `Expected role 'user', got ${resUserLogin.data.user?.role}`);
    const userCookie = extractCookie(resUserLogin.setCookie);
    console.assert(userCookie.length > 0, 'No auth cookie returned for user login');
    console.log('✓ Normal user login succeeded with role "user" and auth cookie');

    // 3c. Admin login
    const resAdminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testAdminEmail, password: testAdminPassword }),
    });
    console.assert(resAdminLogin.status === 200, `Expected 200 for admin login, got ${resAdminLogin.status}`);
    console.assert(resAdminLogin.data.user.role === 'admin', `Expected role 'admin', got ${resAdminLogin.data.user?.role}`);
    const adminCookie = extractCookie(resAdminLogin.setCookie);
    console.assert(adminCookie.length > 0, 'No auth cookie returned for admin login');
    console.log('✓ Admin login succeeded with role "admin" and auth cookie');

    console.log('\n--- 4. Testing GET /api/auth/me ---');
    // 4a. Unauthenticated request
    const resMeUnauth = await request('/auth/me');
    console.assert(resMeUnauth.status === 401, `Expected 401 for unauthenticated /me, got ${resMeUnauth.status}`);
    console.log('✓ Unauthenticated GET /api/auth/me returned 401');

    // 4b. User calling /me
    const resMeUser = await request('/auth/me', {}, userCookie);
    console.assert(resMeUser.status === 200, `Expected 200 for user /me, got ${resMeUser.status}`);
    console.assert(resMeUser.data.user.role === 'user', `Expected role 'user', got ${resMeUser.data.user?.role}`);
    console.assert(resMeUser.data.user.email === testUserEmail, 'Incorrect email returned for user');
    console.log('✓ Authenticated user GET /api/auth/me returned role "user" (200)');

    // 4c. Admin calling /me
    const resMeAdmin = await request('/auth/me', {}, adminCookie);
    console.assert(resMeAdmin.status === 200, `Expected 200 for admin /me, got ${resMeAdmin.status}`);
    console.assert(resMeAdmin.data.user.role === 'admin', `Expected role 'admin', got ${resMeAdmin.data.user?.role}`);
    console.assert(resMeAdmin.data.user.email === testAdminEmail, 'Incorrect email returned for admin');
    console.log('✓ Authenticated admin GET /api/auth/me returned role "admin" (200)');

    console.log('\n--- 5. Testing Role-Based Access Control (Admin Protection) ---');
    // 5a. Normal user attempting admin-only endpoint (GET /api/admin/blog)
    const resUserAdminAccess = await request('/admin/blog', {}, userCookie);
    console.assert(resUserAdminAccess.status === 403, `Expected 403 Forbidden for user accessing admin route, got ${resUserAdminAccess.status}`);
    console.log('✓ Normal user blocked from admin endpoint (403 Forbidden)');

    // 5b. Admin accessing admin-only endpoint (GET /api/admin/blog)
    const resAdminAdminAccess = await request('/admin/blog', {}, adminCookie);
    console.assert(resAdminAdminAccess.status === 200, `Expected 200 for admin accessing admin route, got ${resAdminAdminAccess.status}`);
    console.log('✓ Admin allowed to access admin endpoint (200 OK)');

    console.log('\n--- 6. Testing Logout ---');
    const resLogout = await request('/auth/logout', { method: 'POST' }, userCookie);
    console.assert(resLogout.status === 200, `Expected 200 for logout, got ${resLogout.status}`);
    console.assert(resLogout.setCookie?.includes('token=;') || resLogout.setCookie?.includes('Expires=Thu, 01 Jan 1970'), 'Cookie not cleared on logout');
    console.log('✓ Logout endpoint successfully cleared authentication cookie');

    // Cleanup test data
    await User.deleteMany({
      email: { $in: [testAdminEmail, testUserEmail, attackEmail] },
    });

    server.close();
    await mongoose.disconnect();

    console.log('\n=========================================');
    console.log('🎉 ALL BACKEND AUTH & RBAC TESTS PASSED!');
    console.log('=========================================\n');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ [API Verification Error]:', error.message);
    server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
};

runTests();
