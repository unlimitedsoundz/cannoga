'use client';

import React, { useState } from 'react';
import {
    Cpu,
    Shield,
    Envelope as Mail,
    BookOpen,
    Database,
    Key,
    UserPlus,
    MagnifyingGlass as Search,
    Funnel as Filter,
    ToggleLeft,
    ToggleRight,
    ArrowSquareOut as ExternalLink,
    Warning as AlertTriangle,
    CheckCircle
} from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import { createClient } from '@/utils/supabase/client';
import { SearchField } from '@/components/ui/SearchField';

interface ITManagementClientProps {
    assets: any[];
    accessRecords: any[];
    students: any[];
}

export default function ITManagementClient({
    assets,
    accessRecords,
    students
}: ITManagementClientProps) {
    const [selectedTab, setSelectedTab] = useState<'catalog' | 'access'>('catalog');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [showProvisionModal, setShowProvisionModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedAsset, setSelectedAsset] = useState('');

    const stats = {
        totalAssets: assets.length,
        activeLicenses: accessRecords.filter(r => r.status === 'ACTIVE').length,
        autoProvisioned: assets.filter(a => a.auto_provision).length,
        studentsWithAccess: new Set(accessRecords.map(r => r.student_id)).size
    };

    const filteredAssets = assets.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAccess = accessRecords.filter(r =>
        `${r.student?.user?.first_name} ${r.student?.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.asset?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generateToken = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const generateCredentials = (assetType: string) => {
        switch (assetType) {
            case 'EMAIL':
                return {
                    email: `student${Math.floor(Math.random() * 10000)}@cannogacollege.ca`,
                    password: 'SET_ON_CARST_LOGIN'
                };
            case 'LMS':
                return {
                    username: `student${Math.floor(Math.random() * 10000)}`,
                    access_token: `lms_${generateToken()}`
                };
            case 'VPN':
                return {
                    vpn_key: generateToken(),
                    config_url: 'https://vpn.cannogacollege.ca/config'
                };
            case 'LIBRARY':
                return {
                    library_id: `LIB${Math.floor(Math.random() * 100000)}`,
                    pin: Math.floor(1000 + Math.random() * 9000).toString()
                };
            case 'VIRTUAL_LAB':
                return {
                    lab_username: `vlab_${Math.floor(Math.random() * 10000)}`,
                    access_url: 'https://labs.cannogacollege.ca'
                };
            default:
                return {
                    license_key: generateToken()
                };
        }
    };

    const handleManualProvision = async () => {
        if (!selectedStudent || !selectedAsset) return;
        setLoading(true);
        try {
            const supabase = createClient();

            // 1. Fetch asset details
            const { data: asset, error: assetError } = await supabase
                .from('it_assets')
                .select('*')
                .eq('id', selectedAsset)
                .single();

            if (assetError || !asset) throw new Error('Asset not found');

            const credentials = generateCredentials(asset.asset_type);
            const expiresAt = new Date();
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);

            // 2. Upsert access record
            const { error: upsertError } = await supabase
                .from('student_it_access')
                .upsert({
                    student_id: selectedStudent,
                    asset_id: selectedAsset,
                    credentials,
                    activated_at: new Date().toISOString(),
                    expires_at: expiresAt.toISOString(),
                    status: 'ACTIVE'
                });

            if (upsertError) throw upsertError;

            // 3. Update usage counter
            await supabase
                .from('it_assets')
                .update({ current_usage: asset.current_usage + 1 })
                .eq('id', selectedAsset);

            alert('Asset provisioned successfully.');
            setShowProvisionModal(false);
            window.location.reload();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getAssetIcon = (type: string) => {
        switch (type) {
            case 'LMS': return <BookOpen size={18} />;
            case 'EMAIL': return <Mail size={18} />;
            case 'VPN': return <Shield size={18} />;
            case 'SOFTWARE_LICENSE': return <Key size={18} />;
            case 'VIRTUAL_LAB': return <Cpu size={18} />;
            case 'LIBRARY': return <Database size={18} />;
            default: return <Database size={18} />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">IT Asset Management</h1>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                        Digital Resources & Student Access Control
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowProvisionModal(true)}
                        className="px-4 py-2 bg-[#9c27b3] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2"
                    >
                        <UserPlus size={14} weight="bold" /> Manual Provision
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border-2 border-[#9c27b3] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Total Assets</p>
                    <p className="text-2xl font-black">{stats.totalAssets}</p>
                </div>
                <div className="bg-white border-2 border-[#9c27b3] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Active Licenses</p>
                    <p className="text-2xl font-black">{stats.activeLicenses}</p>
                </div>
                <div className="bg-white border-2 border-[#9c27b3] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Auto-Provisioned</p>
                    <p className="text-2xl font-black">{stats.autoProvisioned}</p>
                </div>
                <div className="bg-white border-2 border-[#9c27b3] p-6 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <p className="text-[10px] font-black uppercase text-neutral-400 mb-1">Students Served</p>
                    <p className="text-2xl font-black">{stats.studentsWithAccess}</p>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-neutral-200 pb-4">
                <div className="flex gap-8">
                    <button
                        onClick={() => setSelectedTab('catalog')}
                        className={`text-[10px] font-black uppercase tracking-widest transition-all relative ${selectedTab === 'catalog' ? 'text-black' : 'text-neutral-400'
                            }`}
                    >
                        Asset Catalog
                        {selectedTab === 'catalog' && <div className="absolute -bottom-[18px] left-0 w-full h-1 bg-[#9c27b3]" />}
                    </button>
                    <button
                        onClick={() => setSelectedTab('access')}
                        className={`text-[10px] font-black uppercase tracking-widest transition-all relative ${selectedTab === 'access' ? 'text-black' : 'text-neutral-400'
                            }`}
                    >
                        Student Access
                        {selectedTab === 'access' && <div className="absolute -bottom-[18px] left-0 w-full h-1 bg-[#9c27b3]" />}
                    </button>
                </div>

                <div className="w-full md:w-64">
                    <SearchField
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(v) => setSearchTerm(v)}
                    />
                </div>
            </div>

            {/* Content Area */}
            {selectedTab === 'catalog' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssets.map((asset) => (
                        <div key={asset.id} className="bg-white border-2 border-[#9c27b3] p-6 rounded-sm hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-neutral-100 rounded-sm group-hover:bg-[#9c27b3] group-hover:text-white transition-all">
                                    {getAssetIcon(asset.asset_type)}
                                </div>
                                <div className="flex items-center gap-1">
                                    {asset.auto_provision ? (
                                        <span className="text-[8px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <CheckCircle size={8} weight="bold" /> Auto
                                        </span>
                                    ) : (
                                        <span className="text-[8px] font-black uppercase bg-neutral-100 text-neutral-400 px-2 py-0.5 rounded-full">Manual</span>
                                    )}
                                </div>
                            </div>

                            <h3 className="font-black uppercase tracking-tight mb-1">{asset.name}</h3>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase mb-6 line-clamp-2">{asset.description}</p>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="font-black text-neutral-400 uppercase">Usage</span>
                                    <span className="font-black">{asset.current_usage} {asset.license_limit ? `/ ${asset.license_limit}` : 'Units'}</span>
                                </div>
                                <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#9c27b3]"
                                        style={{ width: `${asset.license_limit ? (asset.current_usage / asset.license_limit) * 100 : 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border-2 border-[#9c27b3] rounded-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-neutral-50 border-b-2 border-[#9c27b3]">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Student</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Asset</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Expires</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccess.map((record) => (
                                <tr key={record.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-black text-sm">{record.student?.user?.first_name} {record.student?.user?.last_name}</p>
                                        <p className="text-[8px] font-bold text-neutral-400 uppercase">{record.student?.email || record.student?.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-neutral-400">{getAssetIcon(record.asset?.asset_type)}</span>
                                            <p className="font-bold text-xs uppercase">{record.asset?.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${record.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase">
                                        {record.expires_at ? formatToDDMMYYYY(record.expires_at) : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 border border-neutral-200 rounded-sm hover:border-[#9c27b3] transition-all">
                                            <ExternalLink size={14} weight="bold" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Manual Provision Modal */}
            {showProvisionModal && (
                <div className="fixed inset-0 bg-[#9c27b3]/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-[#9c27b3] p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-xl font-black uppercase mb-2 flex items-center gap-2">
                            <Shield className="text-neutral-400" weight="bold" /> Manual Provision
                        </h2>
                        <p className="text-xs text-neutral-500 font-bold uppercase mb-8">Force grant access to digital resources.</p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Select Student</label>
                                <select
                                    className="w-full px-4 py-2 border-2 border-[#9c27b3] font-bold text-sm outline-none bg-white"
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                >
                                    <option value="">Choose Student...</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.user?.first_name} {s.user?.last_name} ({s.student_id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase text-neutral-400 mb-1">Select Asset</label>
                                <select
                                    className="w-full px-4 py-2 border-2 border-[#9c27b3] font-bold text-sm outline-none bg-white"
                                    value={selectedAsset}
                                    onChange={(e) => setSelectedAsset(e.target.value)}
                                >
                                    <option value="">Choose Asset...</option>
                                    {assets.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} ({a.asset_type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowProvisionModal(false)}
                                className="flex-1 py-3 border-2 border-[#9c27b3] text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleManualProvision}
                                disabled={loading || !selectedStudent || !selectedAsset}
                                className="flex-1 py-3 bg-[#9c27b3] text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Provisioning...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

