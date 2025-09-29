import { RateLimitResult } from '../types';

export class RateLimiter {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);
    
    // Get stored attempts
    const attempts = await this.state.storage.get<number[]>('attempts') || [];
    
    // Filter out attempts older than 24 hours
    const recentAttempts = attempts.filter(timestamp => timestamp > dayAgo);
    
    // Check if under limit (2 per 24 hours)
    const allowed = recentAttempts.length < 2;
    
    if (allowed) {
      // Add new attempt
      recentAttempts.push(now);
      await this.state.storage.put('attempts', recentAttempts);
      
      // Set alarm to clean up old data after 24 hours
      await this.state.storage.setAlarm(now + (24 * 60 * 60 * 1000));
    }
    
    const result: RateLimitResult = {
      allowed,
      remaining: Math.max(0, 2 - recentAttempts.length)
    };
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  async alarm(): Promise<void> {
    // Clean up old attempts when alarm triggers
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);
    
    const attempts = await this.state.storage.get<number[]>('attempts') || [];
    const recentAttempts = attempts.filter(timestamp => timestamp > dayAgo);
    
    if (recentAttempts.length > 0) {
      await this.state.storage.put('attempts', recentAttempts);
      // Set next cleanup alarm
      await this.state.storage.setAlarm(now + (24 * 60 * 60 * 1000));
    } else {
      // No recent attempts, clear storage
      await this.state.storage.delete('attempts');
    }
  }
}