import StudentLifeContent from '@/components/student-life/StudentLifeContent';

export const metadata = {
    title: 'Campus Culture & Student Life Portal',
    description: 'Get a glimpse into student events, interest groups, physical recreation, and arts programs active across our campus.',
    alternates: {
        canonical: 'https://cannogacollege.ca/student-life/',
    },
};

export default function StudentLifePage() {
    return <StudentLifeContent />;
}
