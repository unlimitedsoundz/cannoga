create table if not exists page_content (
    id uuid primary key default gen_random_uuid(),
    page_slug text not null,
    section_key text not null,
    content text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists page_content_unique_page_section on page_content(page_slug, section_key);
