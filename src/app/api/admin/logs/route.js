import { requireAdmin } from '@/middleware/adminAuth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth.error) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.adminLog.count()
  ]);

  return Response.json({ 
    logs, 
    total, 
    page, 
    pages: Math.ceil(total / limit) 
  });
}
