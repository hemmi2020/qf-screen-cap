import { prisma } from '@/lib/prisma';

export async function logAdminAction(adminId, action, targetId, details = null, ipAddress = null) {
  try {
    await prisma.adminLog.create({
      data: {
        adminId,
        action,
        targetId,
        details: details ? JSON.stringify(details) : null,
        ipAddress
      }
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

export const AdminActions = {
  DELETE_USER: 'DELETE_USER',
  CHANGE_ROLE: 'CHANGE_ROLE',
  CANCEL_SUBSCRIPTION: 'CANCEL_SUBSCRIPTION',
  VIEW_USER_DETAILS: 'VIEW_USER_DETAILS',
  VIEW_SUBSCRIPTION_DETAILS: 'VIEW_SUBSCRIPTION_DETAILS'
};
