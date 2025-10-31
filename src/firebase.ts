// Lightweight Firebase bootstrap with safe fallbacks.
// Provide your config at runtime via window.AFG_FIREBASE_CONFIG or edit below.

// We avoid hard build dependency by typing as any and try/catch optional import at app layer.

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
};

declare global {
  interface Window { AFG_FIREBASE_CONFIG?: FirebaseConfig }
}

let _appInitialized = false as boolean;
let _auth: any = null;
let _GoogleAuthProvider: any = null;

export function initFirebaseIfPossible(customConfig?: FirebaseConfig): boolean {
  if (_appInitialized) return true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const appMod = require('firebase/app');
    const authMod = require('firebase/auth');
    const cfg: FirebaseConfig = customConfig || (window.AFG_FIREBASE_CONFIG as any);
    if (!cfg || !cfg.apiKey) {
      return false;
    }
    appMod.initializeApp(cfg);
    _auth = authMod.getAuth();
    _GoogleAuthProvider = authMod.GoogleAuthProvider;
    _appInitialized = true;
    return true;
  } catch {
    return false;
  }
}

export function getAuthOrNull(): any {
  return _auth;
}

export function getGoogleProviderOrNull(): any {
  return _GoogleAuthProvider ? new _GoogleAuthProvider() : null;
}


