const AUTH_SESSION_KEY = 'campusconnect.authSession';

const DEMO_ACCOUNT = {
  identifier: 'DEMO2026CS001',
  dob: '2000-01-01',
  user: {
    name: 'Aisha Sharma',
    identifier: 'DEMO2026CS001',
    department: 'Computer Science',
    year: 3,
    campus: 'Northfield College',
    email: 'aisha.sharma@example.test',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces',
  },
};

function normalizeIdentifier(value) {
  return value.trim().replace(/\s+/g, '').toUpperCase();
}

export async function authenticateStudent(identifier, dateOfBirth) {
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  const normalizedIdentifier = normalizeIdentifier(identifier);
  if (normalizedIdentifier !== DEMO_ACCOUNT.identifier || dateOfBirth !== DEMO_ACCOUNT.dob) {
    return null;
  }
  return { ...DEMO_ACCOUNT.user };
}

export function getAuthSession() {
  try {
    const stored = window.localStorage.getItem(AUTH_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function storeAuthSession(user) {
  const session = { user, authenticatedAt: new Date().toISOString() };
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
