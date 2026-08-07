-- Create FAQ Pages Table
CREATE TABLE IF NOT EXISTS faq_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FAQ Table
CREATE TABLE IF NOT EXISTS faq (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    page_id UUID NOT NULL REFERENCES faq_pages(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faq_page_id ON faq(page_id);
CREATE INDEX IF NOT EXISTS idx_faq_order_index ON faq(order_index);
CREATE INDEX IF NOT EXISTS idx_faq_published ON faq(is_published);
CREATE INDEX IF NOT EXISTS idx_faq_pages_slug ON faq_pages(slug);