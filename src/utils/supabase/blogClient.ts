import { createBrowserClient } from '@supabase/ssr';

const blogUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lbkrzyqpdqgtqbodkcyi.supabase.co';
const blogKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxia3J6eXFwZHFndHFib2RrY3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NTcxNTMsImV4cCI6MjEwMTEzMzE1M30.0fnx2dno78--fAlamSlLkywo4fpY_i8WTyuUZa_S_5E';

export function createBlogClient() {
    return createBrowserClient(blogUrl, blogKey);
}
