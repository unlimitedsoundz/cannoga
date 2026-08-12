'use client';

import { Trash as Trash2 } from "@phosphor-icons/react/dist/ssr";
import { createClient } from '@/utils/supabase/client'; // Use client-side supabase
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteApplicationBtn({ id, onSuccess }: { id: string, onSuccess?: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to cancel and delete this application? This action cannot be undone and all uploaded documents will be lost."
        );

        if (!confirmed) return;

        setIsDeleting(true);
        try {
            const supabase = createClient();

            // 1. Client-Side Delete (Relies on RLS)
            const { error } = await supabase
                .from('applications')
                .delete()
                .eq('id', id);

            if (error) throw error;

            if (onSuccess) {
                onSuccess();
            } else {
                router.refresh();
            }
        } catch (error: any) {
            console.error('Delete error:', error);
            alert(error.message || "Failed to delete application");
            setIsDeleting(false);
        }
    };

    return (
        <form onSubmit={handleDelete}>
            <button
                type="submit"
                disabled={isDeleting}
                className="text-neutral-400 hover:text-red-600 transition-colors p-2 disabled:opacity-50"
                title="Cancel & Delete Application"
            >
                <Trash2 size={16} />
            </button>
        </form>
    );
}
