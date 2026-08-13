
'use client';

import React from 'react';
import { Trophy as Award, FileText, CheckCircle, WarningCircle as AlertCircle, TrendUp as TrendingUp, DownloadSimple as Download } from "@phosphor-icons/react";
import { Module, ModuleEnrollment, Semester } from '@/types/database';

interface AcademicRecordClientProps {
    enrollments: (ModuleEnrollment & { module: Module, semester: Semester })[];
}

export default function AcademicRecordClient({ enrollments }: AcademicRecordClientProps) {
    const totalCredits = enrollments
        .filter(e => e.status === 'COMPLETED')
        .reduce((sum, e) => sum + e.module.credits, 0);

    const gradedModules = enrollments.filter(e => e.grade !== null);
    const gpa = gradedModules.length > 0
        ? (gradedModules.reduce((sum, e) => sum + (e.grade || 0), 0) / gradedModules.length).toFixed(2)
        : 'N/A';

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Academic Record</h1>
                    <p className="text-[10px] font-bold text-black uppercase tracking-widest mt-1">
                        Official Student Transcript (Unofficial Copy)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#0f2027] bg-white text-[#0f2027] rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#f8fafc] transition-all">
                        <Download size={14} weight="bold" /> Download PDF Transcript
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0f2027] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#1a3644] transition-all shadow-sm">
                        <FileText size={14} weight="bold" /> Request Official Copy
                    </button>
                </div>
            </div>

            {/* Academic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cumulative GPA</span>
                        <Award className="text-[#0f2027]" size={20} weight="regular" />
                    </div>
                    <div className="text-4xl font-serif font-bold text-[#0f2027] tracking-tight">{gpa}</div>
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-600">
                        <TrendingUp size={12} weight="bold" className="text-[#c89211]" /> Top 15% of Cohort
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Credits Earned</span>
                        <CheckCircle className="text-[#0f2027]" size={20} weight="regular" />
                    </div>
                    <div className="text-4xl font-serif font-bold text-[#0f2027] tracking-tight">{totalCredits} <span className="text-lg text-slate-400 font-sans font-normal">/ 180</span></div>
                    <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div
                            className="bg-[#0f2027] h-full transition-all duration-1000"
                            style={{ width: `${(totalCredits / 180) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Academic Standing</span>
                        <AlertCircle className="text-[#0f2027]" size={20} weight="regular" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-[#0f2027] tracking-tight uppercase">Good Standing</div>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">Next Review: July 2024</p>
                </div>
            </div>

            {/* Detailed Record */}
            <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
                <div className="p-4 bg-[#f8fafc] border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-[#0f2027]">Course History &amp; Grades</h2>
                    <span className="text-[10px] font-bold text-slate-400">Sorted by Semester (Desc)</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest border-b border-slate-200 text-[#0f2027]">
                                <th className="p-4 border-r border-slate-200">Semester</th>
                                <th className="p-4 border-r border-slate-200">Module Code</th>
                                <th className="p-4 border-r border-slate-200">Title</th>
                                <th className="p-4 border-r border-slate-200 text-center">Credits</th>
                                <th className="p-4 border-r border-slate-200 text-center">Grade</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-neutral-400 font-bold uppercase text-[10px] tracking-widest">
                                        No academic records found for this student.
                                    </td>
                                </tr>
                            ) : (
                                enrollments.map((e) => (
                                    <tr key={e.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                        <td className="p-4 border-r border-slate-200 font-bold text-[10px] uppercase truncate max-w-[120px] text-[#0f2027]">
                                            {e.semester.name}
                                        </td>
                                        <td className="p-4 border-r border-slate-200 font-bold text-[10px] uppercase tracking-tighter text-[#0f2027]">
                                            {e.module.code}
                                        </td>
                                        <td className="p-4 border-r border-slate-200 font-bold text-[11px] leading-tight text-slate-800">
                                            {e.module.title}
                                        </td>
                                        <td className="p-4 border-r border-slate-200 text-center font-bold text-[11px] text-[#0f2027]">
                                            {e.module.credits}
                                        </td>
                                        <td className="p-4 border-r border-slate-200 text-center font-bold text-lg text-[#0f2027]">
                                            {e.grade !== null ? e.grade : '-'}
                                        </td>
                                        <td className="p-4 flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border
                                                ${e.grade_status === 'CANAL'
                                                    ? 'bg-neutral-50 border-neutral-500 text-neutral-700'
                                                    : 'bg-amber-50 border-amber-500 text-amber-700'}`}>
                                                {e.grade_status}
                                            </span>
                                            {e.grade_status === 'CANAL' && <CheckCircle size={12} weight="bold" className="text-neutral-500" />}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-sm flex items-start gap-3">
                <AlertCircle className="text-amber-600 mt-1" size={18} weight="bold" />
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-800">Note on Provisional Grades</h3>
                    <p className="text-[11px] font-medium text-amber-700 mt-1">
                        Grades marked as <span className="font-black uppercase">Provisional</span> have been entered by your instructor but are awaiting final verification and electronic signature by the University Registrar. These grades are subject to change during the moderation process.
                    </p>
                </div>
            </div>
        </div>
    );
}

