const rateLimitMap = new Map();

export function rateLimit(identifier, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  
  // Remove old requests outside the time window
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= limit) {
    return { limited: true, retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000) };
  }
  
  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  
  return { limited: false };
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of rateLimitMap.entries()) {
    const recent = requests.filter(time => now - time < 60000);
    if (recent.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, recent);
    }
  }
}, 300000);
