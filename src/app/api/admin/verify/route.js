import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return Response.json({ isAdmin: false }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    return Response.json({ 
      isAdmin: user?.role === 'admin' 
    });
  } catch (error) {
    return Response.json({ 
      isAdmin: false,
      error: error.message 
    }, { status: 500 });
  }
}
