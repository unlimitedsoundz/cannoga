'use client';

import { useEffect, useState } from 'react';
import { Link } from "@aalto-dx/react-components";
import { createClient } from '@/utils/supabase/client';
import RichTextEditor from '@/components/RichTextEditor';
import { pageContentPages, pageContentSectionsByPage, type PageContentSection } from '@/lib/pageContentConfig';

export default function AdminPageContentEditor() {
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
        if (!selectedSection) {
            return;
        }

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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
                            ← Back to Admin
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Admissions Page Content</h1>
                        <p className="text-gray-600">Edit bachelor, master, and tuition page sections with rich text.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving || !selectedSection}
                        className="bg-[#0a151a] text-white px-6 py-3 rounded-lg hover:bg-gray-900 disabled:opacity-60"
                    >
                        {saving ? 'Saving...' : 'Save Section'}
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Pages</h2>
                            <div className="space-y-2">
                                {pageContentPages.map((page) => (
                                    <button
                                        key={page.slug}
                                        type="button"
                                        onClick={() => setSelectedPage(page.slug)}
                                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${selectedPage === page.slug ? 'bg-[#0a151a] text-white' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}`}
                                    >
                                        {page.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">Sections</h2>
                            <div className="space-y-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.sectionKey}
                                        type="button"
                                        onClick={() => setSelectedSectionKey(section.sectionKey)}
                                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all ${selectedSectionKey === section.sectionKey ? 'bg-[#0a151a] text-white' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}`}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <section className="bg-white p-6 rounded-3xl shadow-sm">
                        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">{selectedSection?.label || 'Select a section'}</h2>
                                <p className="text-gray-500">Page: {pageContentPages.find((page) => page.slug === selectedPage)?.name}</p>
                            </div>
                            {message && <div className="text-sm text-green-600">{message}</div>}
                        </div>

                        <div className="min-h-[420px] border border-gray-200 rounded-3xl overflow-hidden">
                            {loading ? (
                                <div className="p-8 text-gray-500">Loading section content…</div>
                            ) : (
                                <RichTextEditor value={content} onChange={setContent} />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

