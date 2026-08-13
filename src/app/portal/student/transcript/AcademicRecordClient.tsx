'use client';

import React from 'react';
import { Trophy as Award, FileText, CheckCircle, Clock } from "@phosphor-icons/react/dist/ssr";
import { ModuleEnrollment } from '@/types/database';

interface AcademicRecordClientProps {
    studentId: string;
    enrollments: (ModuleEnrollment & { module: any, semester: any })[];
}

export default function AcademicRecordClient({ studentId, enrollments }: AcademicRecordClientProps) {
    const finalizedEnrollments = enrollments.filter(e => e.grade_status === 'CANAL');
    const provisionalEnrollments = enrollments.filter(e => e.grade_status === 'PROVISIONAL');

    const calculateGPA = (records: typeof enrollments) => {
        const graded = records.filter(e => e.grade !== null && e.grade_status === 'CANAL');
        if (graded.length === 0) return 'N/A';
        const sum = graded.reduce((acc, e) => acc + (e.grade || 0), 0);
        return (sum / graded.length).toFixed(2);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-0.5 leading-none">Academic Record</h1>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    ID: {studentId}
                </p>
            </div>

            {/* GPA Summary */}
            <div className="bg-white border-2 border-[#0a151a] p-6 rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Cumulative GPA</p>
                        <p className="text-4xl font-black">{calculateGPA(enrollments)}</p>
                    </div>
                </div>
            </div>

            {/* Finalized Grades */}
            <div>
                <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                    <CheckCircle size={20} weight="bold" /> Official Transcript
                </h2>
                <div className="bg-white border-2 border-[#0a151a] rounded-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#0a151a] text-white">
                            <tr>
                                <th className="text-left p-2 md:p-3 text-[10px] font-black uppercase tracking-widest">Module</th>
                                <th className="text-left p-2 md:p-3 text-[10px] font-black uppercase tracking-widest">Sem</th>
                                <th className="text-left p-2 md:p-3 text-[10px] font-black uppercase tracking-widest">Crd</th>
                                <th className="text-left p-2 md:p-3 text-[10px] font-black uppercase tracking-widest">Grd</th>
                                <th className="text-left p-2 md:p-3 text-[10px] font-black uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {finalizedEnrollments.map((enrollment) => (
                                <tr key={enrollment.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="p-2 md:p-3">
                                        <p className="font-bold text-xs leading-none mb-1">{enrollment.module?.code}</p>
                                        <p className="text-[10px] text-neutral-400 line-clamp-1">{enrollment.module?.title}</p>
                                    </td>
                                    <td className="p-2 md:p-3 text-[10px]">{enrollment.semester?.name?.substring(0, 3)}</td>
                                    <td className="p-2 md:p-3 text-xs font-bold">{enrollment.module?.credits}</td>
                                    <td className="p-2 md:p-3 text-sm font-black">{enrollment.grade?.toFixed(1) || 'N/A'}</td>
                                    <td className="p-2 md:p-3">
                                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[7px] font-black uppercase">
                                            {enrollment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {finalizedEnrollments.length === 0 && (
                        <div className="p-12 text-center">
                            <FileText size={48} weight="regular" className="mx-auto text-neutral-200 mb-4" />
                            <p className="font-bold text-neutral-500 uppercase text-sm">No Finalized Grades</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Provisional Grades */}
            {provisionalEnrollments.length > 0 && (
                <div>
                    <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                        <Clock size={20} weight="bold" /> Provisional Grades
                    </h2>
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-sm p-6">
                        <p className="text-xs text-amber-800 mb-4 font-medium">
                            These grades are pending registrar approval and may be subject to change.
                        </p>
                        <div className="space-y-2">
                            {provisionalEnrollments.map((enrollment) => (
                                <div key={enrollment.id} className="flex justify-between items-center bg-white p-3 rounded-sm border border-amber-200">
                                    <div>
                                        <p className="font-bold text-sm">{enrollment.module?.code}</p>
                                        <p className="text-xs text-neutral-500">{enrollment.semester?.name}</p>
                                    </div>
                                    <span className="text-lg font-black">{enrollment.grade?.toFixed(2) || 'Pending'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

