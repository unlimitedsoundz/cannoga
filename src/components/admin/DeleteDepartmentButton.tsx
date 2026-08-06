'use client';

import { useState } from 'react';
import { Trash, CircleNotch as Loader2 } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from 'next/navigation';

interface Props {
    departmentId: string;
    departmentName: string;
}

export default function DeleteDepartmentButton({ departmentId, departmentName }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(`/api/departments?id=${departmentId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to delete department');
            }

            // Success!
            setShowConfirm(false);
            router.refresh();
        } catch (err: any) {
            console.error('Delete error:', err);
            setError(err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="fixed inset-0 bg-[#9c27b3]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 max-w-md w-full shadow-2xl space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Delete Department?</h3>
                        <p className="text-neutral-500">
                            Are you sure you want to delete <span className="font-bold text-black">{departmentName}</span>?
                            This action cannot be undone.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => { setShowConfirm(false); setError(null); }}
                            className="flex-1 px-6 py-3 border border-neutral-200 font-bold hover:bg-neutral-50 transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 px-6 py-3 bg-[#9c27b3] text-white font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 size={18} weight="bold" className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Yes, Delete'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
            title="Delete Department"
        >
            <Trash size={18} weight="bold" />
        </button>
    );
}

