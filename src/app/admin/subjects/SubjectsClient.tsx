
'use client';

import { useState } from 'react';
import { deleteSubject } from '../actions';
import { Book, GraduationCap, Trash, PencilSimple as Edit, MagnifyingGlass as Search, CaretLeft as ChevronLeft, CaretRight as ChevronRight, CaretDoubleLeft as ChevronsLeft, CaretDoubleRight as ChevronsRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import { SearchField } from '@/components/ui/SearchField';

interface SubjectsClientProps {
    subjects: any[];
}

export default function SubjectsClient({ subjects }: SubjectsClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subject.code && subject.code.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Reset to page 1 when search changes
    if (searchTerm && currentPage !== 1) {
        // Note: This needs to be in an effect or handler usually, but here filtering is render-time.
        // However, setting state during render is bad.
        // Better to use useEffect or set in handler.
        // I'll stick to handler for simplicity on input change.
    }

    const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
    const paginatedSubjects = filteredSubjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 leading-tight">Manage Subjects</h1>
                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mt-1">Total subjects: {subjects.length}</p>
                </div>
                <Link href="/admin/subjects/edit" className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-800 transition-colors shrink-0">
                    + New Subject
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                    <div className="w-full max-w-md">
                        <SearchField
                            placeholder="Search subjects..."
                            value={searchTerm}
                            onChange={(v) => {
                                setSearchTerm(v);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                            <th className="p-4 font-bold text-neutral-600 text-sm uppercase tracking-wider">Code / Name</th>
                            <th className="p-4 font-bold text-neutral-600 text-sm uppercase tracking-wider">Course</th>
                            <th className="p-4 font-bold text-neutral-600 text-sm uppercase tracking-wider">Credits</th>
                            <th className="p-4 font-bold text-neutral-600 text-sm uppercase tracking-wider">Semester</th>
                            <th className="p-4 font-bold text-neutral-600 text-sm uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {paginatedSubjects.map((subject) => (
                            <tr key={subject.id} className="hover:bg-neutral-50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-neutral-100 rounded text-neutral-500">
                                            <Book size={18} weight="regular" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-neutral-900">{subject.name}</div>
                                            <div className="text-xs text-neutral-400 font-mono tracking-tighter">{subject.code || 'NO-CODE'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-sm font-medium text-neutral-600">{subject.course?.title || 'Unassigned'}</span>
                                </td>
                                <td className="p-4 text-sm font-bold text-neutral-900">
                                    {subject.creditUnits} Credits
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-bold text-neutral-600">SEM {subject.semester}</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/admin/subjects/edit?id=${subject.id}`} className="p-2 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-600">
                                            <Edit size={16} weight="bold" />
                                        </Link>
                                        <form action={async () => {
                                            await deleteSubject(subject.id);
                                        }}>
                                            <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                                                <Trash size={16} weight="bold" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

                {filteredSubjects.length === 0 && (
                    <div className="p-12 text-center">
                        <GraduationCap className="mx-auto mb-4 text-neutral-200" size={48} weight="regular" />
                        <p className="text-neutral-400">No subjects found matching your search.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {filteredSubjects.length > ITEMS_PER_PAGE && (
                    <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
                        <div className="text-xs text-neutral-400 font-medium">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                            >
                                <ChevronsLeft size={16} weight="bold" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                            >
                                <ChevronLeft size={16} weight="bold" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                            >
                                <ChevronRight size={16} weight="bold" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded disabled:opacity-30"
                            >
                                <ChevronsRight size={16} weight="bold" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
