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
                // Dynamic imports — keeps this out of SSR
                const [
                    { ClassicEditor },
                    { Essentials },
                    { Paragraph },
                    { Bold, Italic },
                    { Heading },
                    { Link },
                    { List },
                    { BlockQuote },
                    { Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload },
                    { Base64UploadAdapter },
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
                    import('@ckeditor/ckeditor5-upload'),
                    import('@ckeditor/ckeditor5-table'),
                ]);

                if (destroyed || !editorContainerRef.current) return;

                const editor = await ClassicEditor.create(editorContainerRef.current, {
                    licenseKey: 'GPL',
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
                        ImageStyle,
                        ImageToolbar,
                        ImageUpload,
                        Base64UploadAdapter,
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
                        toolbar: [
                            'imageTextAlternative', 'toggleImageCaption',
                            '|',
                            'imageStyle:inline', 'imageStyle:block', 'imageStyle:side',
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
