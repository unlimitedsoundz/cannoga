declare module '@supabase/ssr' {
  export function createBrowserClient(supabaseUrl: string, supabaseKey: string, options?: any): any;
  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options: {
      cookies: {
        getAll?: () => any[] | Promise<any[]>;
        setAll?: (cookiesToSet: Array<{ name: string; value: string; options?: any }>) => void;
        get?: (name: string) => string | undefined | Promise<string | undefined>;
        set?: (name: string, value: string, options?: any) => void;
        remove?: (name: string, options?: any) => void;
      };
      [key: string]: any;
    }
  ): any;
  export function createMiddlewareClient(supabaseUrl: string, supabaseKey: string, options?: any): any;
}

