'use client';

import { useEffect, useRef, useState } from 'react';

// CKEditor content styles
import 'ckeditor5/ckeditor5.css';

interface RichTextEditorProps {
    value: string;
    onChange: (data: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<any>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let destroyed = false;

        async function initEditor() {
            try {
                // Dynamic imports keeps this out of SSR
                const [
                    { ClassicEditor },
                    { Essentials },
                    { Paragraph },
                    { Bold, Italic },
                    { Heading },
                    { Link },
                    { List },
                    { BlockQuote },
                    { Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload },
                    { Table, TableToolbar },
                ] = await Promise.all([
                    import('@ckeditor/ckeditor5-editor-classic'),
                    import('@ckeditor/ckeditor5-essentials'),
                    import('@ckeditor/ckeditor5-paragraph'),
                    import('@ckeditor/ckeditor5-basic-styles'),
                    import('@ckeditor/ckeditor5-heading'),
                    import('@ckeditor/ckeditor5-link'),
                    import('@ckeditor/ckeditor5-list'),
                    import('@ckeditor/ckeditor5-block-quote'),
                    import('@ckeditor/ckeditor5-image'),
                    import('@ckeditor/ckeditor5-table'),
                ]);

                if (destroyed || !editorContainerRef.current) return;

                // Custom Supabase Storage Upload Adapter for CKEditor
                class SupabaseUploadAdapter {
                    loader: any;
                    constructor(loader: any) {
                        this.loader = loader;
                    }

                    async upload() {
                        const file = await this.loader.file;
                        const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
                        const fileName = `blog-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

                        // 1. Try Supabase storage first
                        try {
                            const { createBlogClient } = await import('@/utils/supabase/blogClient');
                            const supabase = createBlogClient();

                            const { error } = await supabase.storage
                                .from('blog-images')
                                .upload(fileName, file, {
                                    cacheControl: '31536000',
                                    upsert: false,
                                });

                            if (!error) {
                                const { data: { publicUrl } } = supabase.storage
                                    .from('blog-images')
                                    .getPublicUrl(fileName);

                                if (publicUrl) {
                                    return { default: publicUrl };
                                }
                            } else {
                                console.warn('Supabase storage upload error, falling back:', error.message);
                            }
                        } catch (err) {
                            console.warn('Supabase storage upload failed, attempting fallback endpoint:', err);
                        }

                        // 2. Fallback to /api/upload
                        try {
                            const formData = new FormData();
                            formData.append('file', file);
                            const res = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                            });
                            if (res.ok) {
                                const resData = await res.json();
                                if (resData.success && resData.url) {
                                    return { default: resData.url };
                                }
                            }
                        } catch (apiErr) {
                            console.warn('API /api/upload route failed, attempting hosting upload:', apiErr);
                        }

                        // 3. Fallback to /upload.php (Hostinger environment)
                        try {
                            const { uploadToHosting } = await import('@/utils/hostingUpload');
                            const hostUrl = await uploadToHosting(file);
                            if (hostUrl) {
                                return { default: hostUrl };
                            }
                        } catch (hostErr) {
                            console.error('All upload methods failed:', hostErr);
                            throw hostErr;
                        }

                        throw new Error('Image upload failed across all available storage adapters.');
                    }

                    abort() {
                        // Abort request if needed
                    }
                }

                function SupabaseUploadAdapterPlugin(editorInstance: any) {
                    editorInstance.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
                        return new SupabaseUploadAdapter(loader);
                    };
                }

                const editor = await ClassicEditor.create(editorContainerRef.current, {
                    licenseKey: 'GPL',
                    extraPlugins: [SupabaseUploadAdapterPlugin],
                    plugins: [
                        Essentials,
                        Paragraph,
                        Bold,
                        Italic,
                        Heading,
                        Link,
                        List,
                        BlockQuote,
                        Image,
                        ImageCaption,
                        ImageResize,
                        ImageStyle,
                        ImageToolbar,
                        ImageUpload,
                        Table,
                        TableToolbar,
                    ],
                    toolbar: [
                        'undo', 'redo',
                        '|',
                        'heading',
                        '|',
                        'bold', 'italic',
                        '|',
                        'link', 'uploadImage', 'insertTable', 'blockQuote',
                        '|',
                        'bulletedList', 'numberedList',
                    ],
                    heading: {
                        options: [
                            { model: 'paragraph' as const, title: 'Paragraph', class: 'ck-heading_paragraph' },
                            { model: 'heading1' as const, view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                            { model: 'heading2' as const, view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                            { model: 'heading3' as const, view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                        ]
                    },
                    image: {
                        resizeOptions: [
                            {
                                name: 'resizeImage:original',
                                value: null,
                                label: 'Original'
                            },
                            {
                                name: 'resizeImage:25',
                                value: '25',
                                label: '25%'
                            },
                            {
                                name: 'resizeImage:50',
                                value: '50',
                                label: '50%'
                            },
                            {
                                name: 'resizeImage:75',
                                value: '75',
                                label: '75%'
                            }
                        ],
                        toolbar: [
                            'imageTextAlternative', 'toggleImageCaption',
                            '|',
                            'imageStyle:inline', 'imageStyle:block', 'imageStyle:side',
                            '|',
                            'resizeImage',
                        ]
                    },
                    link: {
                        addTargetToExternalLinks: true,
                    },
                    table: {
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
                    },
                    initialData: value,
                });

                if (destroyed) {
                    editor.destroy();
                    return;
                }

                editorRef.current = editor;
                setIsReady(true);

                let timeoutId: NodeJS.Timeout;
                const updateData = () => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        onChange(editor.getData());
                    }, 100);
                };

                // Listen for any changes to the editor content
                editor.model.document.on('change', updateData);
            } catch (error) {
                console.error('Error initializing CKEditor:', error);
                setIsReady(true); // Show the container even if editor fails
            }
        }

        initEditor();

        return () => {
            destroyed = true;
            if (editorRef.current) {
                editorRef.current.destroy().catch(console.error);
                editorRef.current = null;
            }
        };
    }, []); // Only mount once

    // Update editor content when value prop changes
    useEffect(() => {
        if (editorRef.current && isReady && editorRef.current.getData() !== value) {
            editorRef.current.setData(value);
        }
    }, [value, isReady]);

    return (
        <div className="ck-editor-wrapper">
            <div ref={editorContainerRef} className="min-h-[200px]" />
            {!isReady && (
                <div className="w-full h-[300px] border rounded flex items-center justify-center text-gray-400">
                    Loading editor…
                </div>
            )}
        </div>
    );
}
