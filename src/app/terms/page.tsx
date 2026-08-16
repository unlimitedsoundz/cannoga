import TermsContent from '@/components/legal/TermsContent';

export const metadata = {
    title: 'Terms of Use & Site Agreements',
    description: 'Legal terms and standard rules governing access to and usage of the public Cannoga online portal.',
    alternates: {
        canonical: 'https://cannogacollege.ca/terms/',
    },
};

export default function TermsOfUsePage() {
    return <TermsContent />;
}
