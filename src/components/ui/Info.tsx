import React from 'react';
import { TagGroup } from './TagGroup';

interface Tag {
    label: string;
}

interface TagGroupType {
    tags: Tag[];
}

interface InfoItem {
    title?: string;
    body?: string;
    tagGroup?: TagGroupType;
}

interface InfoProps {
    items: InfoItem[];
    className?: string;
}

export const Info: React.FC<InfoProps> = ({ items, className = "" }) => {
    return (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-b border-neutral-100 my-8 ${className}`}>
            {items.map((item, index) => (
                <div key={index} className="space-y-2">
                    {item.title && (
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">
                            {item.title}
                        </h4>
                    )}
                    {item.body && (
                        <p className="text-sm font-bold text-black">
                            {item.body}
                        </p>
                    )}
                    {item.tagGroup && (
                        <div className="pt-1">
                            <TagGroup tags={item.tagGroup.tags} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
