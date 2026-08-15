
'use client';

import React from 'react';
import { Key, Shield, Cloud, BookOpen, Flask, Laptop } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import { StudentItAccess, ItAsset } from '@/types/database';

interface ItAccessClientProps {
    access: (StudentItAccess & { asset: ItAsset })[];
}

const ASSET_ICONS: Record<string, React.ReactNode> = {
    'LMS': <BookOpen size={24} />,
    'EMAIL': <Key size={24} />,
    'VPN': <Shield size={24} />,
    'LIBRARY': <BookOpen size={24} />,
    'VIRTUAL_LAB': <Flask size={24} weight="regular" />,
    'SOFTWARE_LICENSE': <Laptop size={24} weight="regular" />
};

export default function ItAccessClient({ access }: ItAccessClientProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter mb-0.5 leading-none">IT Credentials & Access</h1>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Digital Campus Resources
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {access.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white border-2 border-[#0a151a] p-5 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#0a151a] text-white rounded-sm flex items-center justify-center">
                                    {item.asset ? (ASSET_ICONS[item.asset.asset_type] || <Cloud size={20} weight="regular" />) : <Cloud size={20} weight="regular" />}
                                </div>
                                <div>
                                    <h3 className="font-black text-base uppercase leading-none mb-1">{item.asset?.name || 'Unknown Asset'}</h3>
                                    <p className="text-[9px] font-bold text-neutral-500 uppercase leading-none">{item.asset?.asset_type || 'N/A'}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                                }`}>
                                {item.status}
                            </span>
                        </div>

                        {item.asset?.description && (
                            <p className="text-sm text-neutral-600 mb-4">{item.asset.description}</p>
                        )}

                        {item.credentials && (
                            <div className="bg-neutral-50 p-4 rounded-sm border border-neutral-200 space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Credentials</p>
                                {Object.entries(item.credentials).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center text-xs">
                                        <span className="font-bold uppercase text-neutral-500">{key.replace('_', ' ')}</span>
                                        <span className="font-mono font-medium">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {item.asset?.access_url && (
                            <div className="mt-4">
                                <a
                                    href={item.asset.access_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-[#0a151a] text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all"
                                >
                                    Access Portal â†’
                                </a>
                            </div>
                        )}

                        {item.expires_at && (
                            <p className="text-[10px] font-bold text-neutral-400 mt-4 uppercase">
                                Expires: {formatToDDMMYYYY(item.expires_at)}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {access.length === 0 && (
                <div className="bg-neutral-50 border-2 border-neutral-200 p-12 rounded-sm text-center">
                    <Cloud size={48} weight="regular" className="mx-auto text-neutral-300 mb-4" />
                    <p className="font-bold text-neutral-500 uppercase text-sm">No IT Access Provisioned</p>
                    <p className="text-xs text-neutral-400 mt-2">Contact IT Support if this is an error.</p>
                </div>
            )}
        </div>
    );
}

