import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email, secret } = await request.json();
    
    // Change this secret key and delete this file after first use
    const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'change-me-in-production';
    
    if (secret !== SETUP_SECRET) {
      return Response.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role === 'admin') {
      return Response.json({ 
        message: 'User is already an admin',
        user: { email: user.email, role: user.role }
      });
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    });

    return Response.json({ 
      success: true,
      message: 'User promoted to admin successfully',
      user: { email, role: 'admin' }
    });

  } catch (error) {
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
