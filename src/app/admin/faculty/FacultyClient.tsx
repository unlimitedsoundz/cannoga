
'use client';

import { useState } from 'react';
import { deleteFaculty } from '../actions';
import { Trash, PencilSimple as Edit, Envelope as Mail, Buildings as SchoolIcon, MagnifyingGlass as Search, CaretLeft as ChevronLeft, CaretRight as ChevronRight, CaretDoubleLeft as ChevronsLeft, CaretDoubleRight as ChevronsRight, Users } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";
import { SearchField } from '@/components/ui/SearchField';

interface FacultyClientProps {
    faculty: any[];
}

export default function FacultyClient({ faculty }: FacultyClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const filteredFaculty = faculty.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFaculty.length / ITEMS_PER_PAGE);
    const paginatedFaculty = filteredFaculty.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 leading-tight">Faculty Editor</h1>
                    <p className="text-neutral-500 mt-1">Manage academic staff and administration</p>
                </div>
                <Link
                    href="/admin/faculty/edit"
                    className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg flex items-center gap-2"
                >
                    New Faculty member
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                    <div className="w-full max-w-md">
                        <SearchField
                            placeholder="Search faculty by name, email, or role..."
                            value={searchTerm}
                            onChange={(v) => {
                                setSearchTerm(v);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                        Total Members: {filteredFaculty.length}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="p-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Member</th>
                                <th className="p-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">Role & Dept</th>
                                <th className="p-5 text-xs font-bold text-neutral-400 uppercase tracking-widest">School</th>
                                <th className="p-5 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {paginatedFaculty.map((person) => (
                                <tr key={person.id} className="hover:bg-neutral-50 group transition-colors">
                                    <td className="p-5">
                                        <div>
                                            <div className="font-bold text-neutral-900">{person.name}</div>
                                            <div className="text-xs text-neutral-400 flex items-center gap-1">
                                                <Mail size={12} weight="regular" /> {person.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="text-sm font-semibold text-neutral-700">{person.role}</div>
                                        <div className="text-xs text-neutral-500 italic">{person.department?.name || 'No department'}</div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                            <SchoolIcon size={14} weight="regular" className="text-neutral-400" />
                                            {person.school?.name}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/faculty/edit?id=${person.id}`}
                                                className="p-2 border border-neutral-200 rounded-lg hover:bg-white hover:shadow-md transition-all text-neutral-600"
                                                title="Edit"
                                            >
                                                <Edit size={16} weight="bold" />
                                            </Link>
                                            <form action={async () => {
                                                await deleteFaculty(person.id);
                                            }}>
                                                <button
                                                    className="p-2 border border-neutral-200 rounded-lg hover:bg-red-50 hover:border-red-200 text-red-600 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash size={16} weight="bold" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredFaculty.length === 0 && (
                        <div className="p-12 text-center">
                            <Users className="mx-auto mb-4 text-neutral-200" size={48} weight="regular" />
                            <p className="text-neutral-400 font-bold uppercase text-xs tracking-widest">No faculty members found matching your search.</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredFaculty.length > ITEMS_PER_PAGE && (
                        <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/20">
                            <div className="text-xs text-neutral-400 font-bold uppercase tracking-widest">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                                    title="First Page"
                                >
                                    <ChevronsLeft size={16} weight="bold" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                                    title="Previous Page"
                                >
                                    <ChevronLeft size={16} weight="bold" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                                    title="Next Page"
                                >
                                    <ChevronRight size={16} weight="bold" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 text-neutral-400 hover:text-black hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
                                    title="Last Page"
                                >
                                    <ChevronsRight size={16} weight="bold" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
