import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { deleteStudent } from './actions';

export default function DeleteStudentBtn({ id }: { id: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this student record? This will revert their status and allow for re-enrollment if needed.')) {
            return;
        }

        setIsDeleting(true);

        try {
            const result = await deleteStudent(id);

            if (result.success) {
                router.refresh();
                // We might need a manual window.location.reload() if refresh doesn't catch all state changes
                // but router.refresh() is the standard Next.js way.
            } else {
                alert(`Failed to delete student: ${result.error}`);
            }
        } catch (error: any) {
            console.error('Delete Student Error:', error);
            alert(`An unexpected error occurred: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-neutral-400 hover:text-red-600 transition-colors p-1 disabled:opacity-50"
            title="Delete Student"
        >
            {isDeleting ? (
                <Loader2 size={14} weight="bold" className="animate-spin" />
            ) : (
                <Trash size={14} weight="bold" />
            )}
        </button>
    );
}
