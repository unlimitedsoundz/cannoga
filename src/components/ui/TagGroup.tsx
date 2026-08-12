'use client';

import { GraduationCap, Users } from '@phosphor-icons/react/dist/ssr';

interface Tag {
  label: string;
  icon?: string;
}

interface TagGroupProps {
  tags: Tag[];
}

const iconMap = {
  'graduation-cap': GraduationCap,
  'persons': Users,
};

export function TagGroup({ tags }: TagGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => {
        const IconComponent = tag.icon ? iconMap[tag.icon as keyof typeof iconMap] : null;

        return (
          <div key={index} className="tag-pill">
            {IconComponent && <IconComponent size={14} weight="bold" />}
            <span>{tag.label}</span>
          </div>
        );
      })}
    </div>
  );
}
