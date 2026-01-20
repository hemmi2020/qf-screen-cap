import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit } from './rateLimit';

export async function requireAdmin(request = null) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Rate limiting
  if (request) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { limited, retryAfter } = rateLimit(`admin:${session.user.id}:${ip}`, 30, 60000);
    
    if (limited) {
      return { error: `Rate limit exceeded. Retry after ${retryAfter}s`, status: 429 };
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, id: true }
  });

  if (user?.role !== 'admin') {
    return { error: 'Forbidden - Admin access required', status: 403 };
  }

  return { user: { ...session.user, id: user.id } };
}
