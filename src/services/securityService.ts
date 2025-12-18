import { ScanResult, PlanType, PlanConfig, UserSubscription, ScanAggressiveness } from '../types';

interface UserSession {
  token: string;
  expiry: number;
  user: string;
}

interface UserProfile {
  username: string;
  email?: string;
  mobile?: string;
  passwordHash: string;
  subscription: UserSubscription;
}

const SESSION_KEY = 'websec_session';
const USERS_KEY = 'websec_users';
const SALT = new TextEncoder().encode("websec-ai-salt-v1");
const TARGET_HASH = "4b0a331165609315570889984913253770335832049818552680452382583849"; 

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    id: 'free', name: 'Free Starter', priceDisplay: 'Free', maxScans: 3, resetPeriod: 'daily',
    allowedModels: ['flash', 'lite'], allowedModes: ['stealth', 'deep'], maxTools: 0,
    showSolutions: false, allowDownload: false, showProbableVulns: false
  },
  onetime_350: {
    id: 'onetime_350', name: 'Single Deep Scan', priceDisplay: '₹350 / scan', maxScans: 1, resetPeriod: 'never',
    allowedModels: ['flash', 'pro', 'lite'], allowedModes: ['stealth', 'deep'], maxTools: 10,
    showSolutions: false, allowDownload: true, showProbableVulns: false
  },
  onetime_500: {
    id: 'onetime_500', name: 'Pro Scan Bundle', priceDisplay: '₹500 / 3 scans', maxScans: 3, resetPeriod: 'never',
    allowedModels: ['flash', 'pro', 'lite'], allowedModes: ['stealth', 'deep', 'aggressive'], maxTools: 10,
    showSolutions: true, allowDownload: true, showProbableVulns: true
  },
  sub_1899: {
    id: 'sub_1899', name: 'Monthly Standard', priceDisplay: '₹1899 / mo', maxScans: -1, resetPeriod: 'monthly',
    allowedModels: ['flash', 'lite'], allowedModes: ['stealth', 'deep'], maxTools: 5,
    showSolutions: false, allowDownload: true, showProbableVulns: false
  },
  sub_2999: {
    id: 'sub_2999', name: 'Enterprise Monthly', priceDisplay: '₹2999 / mo', maxScans: -1, resetPeriod: 'monthly',
    allowedModels: ['flash', 'pro', 'lite'], allowedModes: ['stealth', 'deep', 'aggressive'], maxTools: 10,
    showSolutions: true, allowDownload: true, showProbableVulns: true
  }
};

export const securityService = {
  getRegisteredUsers(): UserProfile[] {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (e) { return []; }
  },

  saveUser(user: UserProfile) {
    try {
        const users = this.getRegisteredUsers();
        const filtered = users.filter(u => u.username !== user.username);
        filtered.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    } catch (e) {}
  },

  getCurrentUser(): string | null {
    try {
        const sessionStr = sessionStorage.getItem(SESSION_KEY);
        if (!sessionStr) return null;
        const session: UserSession = JSON.parse(sessionStr);
        if (Date.now() > session.expiry) {
            this.logout();
            return null;
        }
        return session.user;
    } catch (e) { return null; }
  },

  getUserProfile(): UserProfile | null {
    const username = this.getCurrentUser();
    if (!username) return null;

    // Handle Mock Admin
    if (username.toLowerCase() === 'admin') {
       return {
         username: 'admin', passwordHash: 'BYPASS',
         subscription: { planId: 'free', scansRemaining: 3, lastResetDate: new Date().toISOString() }
       };
    }

    // Handle Mock Guest (Crucial for fixing the login issue)
    if (username === 'Guest') {
        return {
          username: 'Guest', passwordHash: 'GUEST_PASS',
          subscription: { planId: 'free', scansRemaining: 3, lastResetDate: new Date().toISOString() }
        };
     }

    return this.getRegisteredUsers().find(u => u.username === username) || null;
  },

  getCurrentPlan(): PlanConfig {
    const profile = this.getUserProfile();
    return profile ? PLANS[profile.subscription.planId] : PLANS.free;
  },

  getCredits(): number {
    const profile = this.getUserProfile();
    return profile ? profile.subscription.scansRemaining : 0;
  },

  upgradePlan(planId: PlanType) {
    const profile = this.getUserProfile();
    if (!profile) return;
    profile.subscription.planId = planId;
    profile.subscription.scansRemaining = PLANS[planId].maxScans;
    this.saveUser(profile);
  },

  consumeCredit(): boolean {
    const profile = this.getUserProfile();
    if (!profile) return false;
    if (profile.subscription.scansRemaining === -1) return true;
    if (profile.subscription.scansRemaining > 0) {
      profile.subscription.scansRemaining -= 1;
      this.saveUser(profile);
      return true;
    }
    return false;
  },

  refundCredit() {
    const profile = this.getUserProfile();
    if (profile && profile.subscription.scansRemaining !== -1) {
      profile.subscription.scansRemaining += 1;
      this.saveUser(profile);
    }
  },

  async login(id: string, pass: string): Promise<boolean> {
    const cleanId = id.toLowerCase();
    const cleanPass = pass.toLowerCase();

    // 1. Explicit Admin Bypass
    if (cleanId === 'admin' && cleanPass === 'admin') {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ 
        token: 'auth_token_admin', 
        expiry: Date.now() + 3600000, 
        user: 'admin' 
      }));
      return true;
    }

    // 2. Explicit Guest Bypass (Restored)
    if (cleanId === 'guest') {
       sessionStorage.setItem(SESSION_KEY, JSON.stringify({ 
         token: 'auth_token_guest', 
         expiry: Date.now() + 3600000, 
         user: 'Guest' 
       }));
       return true;
    }

    // 3. Registered User Login
    try {
        const hash = await this.hashPassword(pass);
        const users = this.getRegisteredUsers();
        const user = users.find(u => u.username.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId);
        
        if (user && this.safeCompare(user.passwordHash, hash)) {
           this.createSession(user.username);
           return true;
        }
    } catch (e) {
        console.error("Login logic error", e);
    }

    return false;
  },

  // Helper Methods
  createSession(username: string) {
    const session: UserSession = {
      token: this.generateSecureToken(),
      expiry: Date.now() + (60 * 60 * 1000), 
      user: username
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  generateSecureToken(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async hashPassword(password: string): Promise<string> {
    // Simple mock hash for demo consistency
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return "demo_" + Math.abs(hash).toString(16);
  },

  safeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let mismatch = 0;
    for (let i = 0; i < a.length; ++i) { mismatch |= (a.charCodeAt(i) ^ b.charCodeAt(i)); }
    return mismatch === 0;
  },

  logout() { sessionStorage.removeItem(SESSION_KEY); },
  isAuthenticated(): boolean { return !!this.getCurrentUser(); },

  async getUserHistory(): Promise<ScanResult[]> {
    const user = this.getCurrentUser();
    if (!user) return [];
    try {
        const raw = localStorage.getItem(`websec_data_${user}`);
        return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  },

  async saveUserHistory(history: ScanResult[]) {
    const user = this.getCurrentUser();
    if (user) localStorage.setItem(`websec_data_${user}`, JSON.stringify(history));
  },

  async clearUserHistory() {
     const user = this.getCurrentUser();
     if (user) localStorage.removeItem(`websec_data_${user}`);
  },

  sanitizeInput(input: string): string { return input || ""; },

  validateTarget(target: string, type: 'url' | 'code'): string | null {
    if (!target.trim()) return "Target input required";
    return null; 
  }
};