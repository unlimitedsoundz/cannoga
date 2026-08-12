declare module '@supabase/ssr' {
  export function createBrowserClient(config: { url: string; key: string }): any;
  export function createServerClient(config: { url: string; key: string }, cookies: any): any;
  export function createMiddlewareClient(config: { url: string; key: string }, cookies: any): any;
}
