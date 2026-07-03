export function setCookie(name: string, value: string, options?: any) {
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (options) {
    if (options.maxAge) {
      cookieString += `; Max-Age=${options.maxAge}`;
    }
    if (options.secure) {
      cookieString += "; Secure";
    }
    if (options.sameSite) {
      cookieString += `; SameSite=${options.sameSite}`;
    }
  }
  
  document.cookie = cookieString;
}
