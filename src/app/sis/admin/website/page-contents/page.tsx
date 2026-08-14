'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { createClient } from '@/utils/supabase/client';
import RichTextEditor from '@/components/RichTextEditor';
import { pageContentPages, pageContentSectionsByPage } from '@/lib/pageContentConfig';

export default function AdminPageContentPage() {
    const [selectedPage, setSelectedPage] = useState(pageContentPages[0]?.slug || '');
    const [selectedSectionKey, setSelectedSectionKey] = useState(pageContentSectionsByPage[pageContentPages[0]?.slug || '']?.[0]?.sectionKey || '');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const sections = selectedPage ? pageContentSectionsByPage[selectedPage] || [] : [];
    const selectedSection = sections.find((section) => section.sectionKey === selectedSectionKey) || sections[0];

    useEffect(() => {
        if (selectedPage && sections.length > 0) {
            setSelectedSectionKey((current) => {
                if (!current || !sections.some((section) => section.sectionKey === current)) {
                    return sections[0].sectionKey;
                }
                return current;
            });
        }
    }, [selectedPage, sections]);

    useEffect(() => {
        let mounted = true;

        async function fetchSection() {
            if (!selectedSection) {
                setContent('');
                setLoading(false);
                return;
            }

            setLoading(true);
            setMessage('');

            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('page_content')
                    .select('content')
                    .eq('page_slug', selectedPage)
                    .eq('section_key', selectedSection.sectionKey)
                    .single();

                if (!error && data?.content && mounted) {
                    setContent(data.content);
                } else if (mounted) {
                    setContent(selectedSection.defaultContent);
                }
            } catch (err) {
                console.error('Error loading page section content:', err);
                if (mounted) {
                    setContent(selectedSection?.defaultContent || '');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchSection();

        return () => {
            mounted = false;
        };
    }, [selectedPage, selectedSection]);

    const handleSave = async () => {
        if (!selectedSection) return;

        setSaving(true);
        setMessage('');

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('page_content')
                .upsert(
                    {
                        page_slug: selectedPage,
                        section_key: selectedSection.sectionKey,
                        content,
                    },
                    { onConflict: 'page_slug,section_key' }
                );

            if (error) {
                console.error('Error saving page content:', error);
                setMessage('Unable to save content.');
            } else {
                setMessage('Content saved successfully.');
            }
        } catch (err) {
            console.error('Save failed:', err);
            setMessage('Unable to save content.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Page Contents Editor"
                subtitle="Edit dynamic website sections stored in Supabase (page_content table)"
                actions={
                    <button
                        onClick={handleSave}
                        disabled={saving || !selectedSection}
                        className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Section'}
                    </button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="space-y-6">
                    <div className="bg-[#0f2027] border border-white/10 p-5 rounded-2xl">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Pages</h2>
                        <div className="space-y-1.5">
                            {pageContentPages.map((page) => (
                                <button
                                    key={page.slug}
                                    type="button"
                                    onClick={() => setSelectedPage(page.slug)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedPage === page.slug ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {page.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0f2027] border border-white/10 p-5 rounded-2xl">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Sections</h2>
                        <div className="space-y-1.5">
                            {sections.map((section) => (
                                <button
                                    key={section.sectionKey}
                                    type="button"
                                    onClick={() => setSelectedSectionKey(section.sectionKey)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${selectedSectionKey === section.sectionKey ? 'bg-sky-500 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <section className="bg-[#0f2027] border border-white/10 p-6 rounded-2xl space-y-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">{selectedSection?.label || 'Select a section'}</h2>
                            <p className="text-xs text-slate-400 font-mono">Page: {pageContentPages.find((page) => page.slug === selectedPage)?.name}</p>
                        </div>
                        {message && <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">{message}</div>}
                    </div>

                    <div className="min-h-[420px] border border-white/10 rounded-xl overflow-hidden bg-white text-slate-900">
                        {loading ? (
                            <div className="p-8 text-slate-400 text-xs uppercase font-bold tracking-wider">Loading section content…</div>
                        ) : (
                            <RichTextEditor value={content} onChange={setContent} />
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
