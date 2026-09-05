export interface ScheduleItem {
  id: string;
  title: string;
  dayOrDate: string;
  description: string;
  speaker: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id?: string;
  name: string;
  email: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured: boolean;
  status: 'draft' | 'published';
  author: Author;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface ApiCustomError extends Error {
  status?: number;
  errors?: unknown;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Helper for standard JSON requests
async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; user?: User; errors?: unknown }> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include', // CRITICAL: Sends httpOnly cookie
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = json.message || `Request failed with status ${res.status}`;
    const err: ApiCustomError = new Error(errorMsg);
    err.status = res.status;
    err.errors = json.errors;
    throw err;
  }

  return json;
}

// PUBLIC APIS
export async function fetchSchedule(): Promise<ScheduleItem[]> {
  const res = await fetch(`${API_BASE_URL}/schedule`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch schedule: ${res.statusText}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchPublicBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE_URL}/blog`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch blog posts: ${res.statusText}`);
  const json = await res.json();
  return json.data || [];
}

export async function fetchPublicBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE_URL}/blog/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch blog post: ${res.statusText}`);
  const json = await res.json();
  return json.data || null;
}

// AUTH APIS
export async function registerApi(name: string, email: string, password: string): Promise<User> {
  const json = await apiRequest<{ user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return json.user!;
}

export async function loginApi(email: string, password: string): Promise<User> {
  const json = await apiRequest<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return json.user!;
}

export async function logoutApi(): Promise<void> {
  await apiRequest('/auth/logout', { method: 'POST' });
}

export async function getMeApi(): Promise<User> {
  const json = await apiRequest<{ user: User }>('/auth/me', { method: 'GET' });
  return json.user!;
}

// ADMIN SCHEDULE APIS
export async function createScheduleItemApi(data: Partial<ScheduleItem>): Promise<ScheduleItem> {
  const json = await apiRequest<ScheduleItem>('/schedule', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return json.data!;
}

export async function updateScheduleItemApi(id: string, data: Partial<ScheduleItem>): Promise<ScheduleItem> {
  const json = await apiRequest<ScheduleItem>(`/schedule/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return json.data!;
}

export async function deleteScheduleItemApi(id: string): Promise<void> {
  await apiRequest(`/schedule/${id}`, { method: 'DELETE' });
}

// ADMIN BLOG APIS
export async function fetchAdminBlogPosts(): Promise<BlogPost[]> {
  const json = await apiRequest<BlogPost[]>('/admin/blog', { method: 'GET' });
  return json.data || [];
}

export async function createAdminBlogPostApi(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured: boolean;
  status: 'draft' | 'published';
}): Promise<BlogPost> {
  const json = await apiRequest<BlogPost>('/admin/blog', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return json.data!;
}

export async function updateAdminBlogPostApi(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured: boolean;
    status: 'draft' | 'published';
  }>
): Promise<BlogPost> {
  const json = await apiRequest<BlogPost>(`/admin/blog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return json.data!;
}

export async function deleteAdminBlogPostApi(id: string): Promise<void> {
  await apiRequest(`/admin/blog/${id}`, { method: 'DELETE' });
}
