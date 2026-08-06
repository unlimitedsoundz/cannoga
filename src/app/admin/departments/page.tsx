'use client';

import { createClient } from '@/utils/supabase/client';
import { PencilSimple as Edit, Buildings as SchoolIcon, CircleNotch as Loader2 } from "@phosphor-icons/react";
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import DeleteDepartmentButton from '@/components/admin/DeleteDepartmentButton';
import { useState, useEffect } from 'react';

export default function AdminDepartmentsPage() {
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            const supabase = createClient();
            try {
                // Fetch departments with school and HOD details
                const { data } = await supabase
                    .from('Department')
                    .select(`
                        *,
                        school:School(name),
                        headOfDepartment:Faculty!headofdepartmentid(name)
                    `)
                    .order('name', { ascending: true });

                setDepartments(data || []);
            } catch (error) {
                console.error("Error fetching departments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    // Group by school
    const groupedDepartments: Record<string, any[]> = {};
    departments.forEach(dept => {
        const schoolName = dept.school?.name || 'Unassigned';
        if (!groupedDepartments[schoolName]) {
            groupedDepartments[schoolName] = [];
        }
        groupedDepartments[schoolName].push(dept);
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={40} weight="bold" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-24 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-neutral-900 tracking-tight">Academic Departments</h1>
                    <p className="text-neutral-500 font-medium">Manage department details, featured images, and leadership.</p>
                </div>
            </div>

            <div className="space-y-16">
                {Object.entries(groupedDepartments).map(([schoolName, depts]) => (
                    <div key={schoolName} className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                            <SchoolIcon size={24} weight="bold" className="text-neutral-300" />
                            <h2 className="text-2xl font-bold text-neutral-900">{schoolName}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {depts.map((dept) => (
                                <div key={dept.id} className="bg-white border border-neutral-100 overflow-hidden group hover:shadow-xl hover:border-[#9c27b3] transition-all duration-500 rounded-sm">
                                    <div className="aspect-[16/9] relative bg-neutral-100 overflow-hidden">
                                        <Image
                                            src={dept.imageUrl || `/images/placeholders/${dept.slug}.png`}
                                            alt={dept.name}
                                            fill
                                            className="object-cover object-top opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/departments/edit?id=${dept.id}`}
                                                className="bg-white/90 backdrop-blur-sm p-3 hover:bg-[#9c27b3] hover:text-white transition-all duration-300 shadow-sm border border-neutral-200"
                                            >
                                                <Edit size={18} weight="bold" />
                                            </Link>
                                            <DeleteDepartmentButton
                                                departmentId={dept.id}
                                                departmentName={dept.name}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-1 text-neutral-900">Department of {dept.name.replace('Department of', '').trim()}</h3>
                                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest mb-4">{dept.slug}</p>

                                        <div className="pt-4 border-t border-neutral-50 border-dashed">
                                            <p className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Head of Department</p>
                                            <p className="text-sm font-bold text-neutral-800">
                                                {dept.headOfDepartment?.name || 'To be appointed'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {departments.length === 0 && (
                    <div className="p-20 text-center border-2 border-dashed border-neutral-100 rounded-3xl">
                        <SchoolIcon size={48} weight="regular" className="mx-auto mb-4 opacity-10" />
                        <p className="font-bold uppercase tracking-widest text-neutral-400 text-xs">No active departments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


