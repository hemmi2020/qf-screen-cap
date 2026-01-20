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
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type');

  const where = {
    ...(search && {
      OR: [
        { userEmail: { contains: search, mode: 'insensitive' } },
        { url: { contains: search, mode: 'insensitive' } }
      ]
    }),
    ...(type && { type })
  };

  const [searches, total] = await Promise.all([
    prisma.search.findMany({
      where,
      include: {
        user: {
          select: { email: true, name: true, role: true }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.search.count({ where })
  ]);

  return Response.json({ 
    searches, 
    total, 
    page, 
    pages: Math.ceil(total / limit) 
  });
}
