'use client';

import { useState, useRef } from 'react';
import { UploadSimple as Upload, X, Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";
import Image from 'next/image';

interface ImageUploadProps {
    name: string;
    defaultValue?: string;
}

export default function ImageUpload({ name, defaultValue }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            <label className="text-sm font-bold text-neutral-600 block">Profile Photo</label>
            <div
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square rounded-3xl bg-neutral-50 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center overflow-hidden group hover:bg-neutral-100 hover:border-neutral-400 transition-all cursor-pointer"
            >
                {preview ? (
                    <>
                        <div className="relative w-full h-full">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                unoptimized
                                className="object-cover object-top"
                            />
                        </div>
                        <div className="absolute inset-0 bg-[#9c27b3]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change Photo</p>
                        </div>
                        <button
                            onClick={clearImage}
                            className="absolute top-2 right-2 w-8 h-8 bg-[#9c27b3]/60 text-white rounded-full flex items-center justify-center hover:bg-[#9c27b3] transition-colors z-10"
                        >
                            <X size={16} weight="bold" />
                        </button>
                    </>
                ) : (
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-2 text-neutral-500 group-hover:scale-110 transition-transform">
                            <Upload size={20} weight="bold" />
                        </div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Upload Image</p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
            <p className="text-[10px] text-neutral-400 leading-tight italic">Recommended: Square aspect ratio, under 2MB.</p>
        </div>
    );
}


