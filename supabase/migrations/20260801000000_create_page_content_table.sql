CREATE TABLE IF NOT EXISTS public.page_content (
    id SERIAL PRIMARY KEY,
    page_slug TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT,
    UNIQUE(page_slug, section_key)
);

CREATE INDEX IF NOT EXISTS idx_page_content_page_slug ON public.page_content(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_content_section_key ON public.page_content(section_key);
