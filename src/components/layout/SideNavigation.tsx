import { NavigationAccordion } from "@/components/ui/NavigationAccordion";

interface NavLink {
    label: string;
    linkComponentProps?: {
        href: string;
    };
    highlighted?: boolean;
    hidden?: boolean;
}

interface NavSection {
    header: NavLink;
    links: NavLink[];
}

interface SideNavigationProps {
    sections: NavSection[];
    onChange?: (value: string) => void;
}

export function SideNavigation({ sections, onChange }: SideNavigationProps) {
    return (
        <div className="w-80 h-full bg-transparent">
            <NavigationAccordion sections={sections} onChange={onChange} />
        </div>
    );
}
