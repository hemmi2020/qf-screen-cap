import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ subscription: null }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    });

    return Response.json({ subscription });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return Response.json({ subscription: null }, { status: 500 });
  }
}
