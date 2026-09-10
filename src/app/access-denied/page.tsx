import Link from 'next/link';
import { ShieldSlash, CaretLeft } from '@phosphor-icons/react/dist/ssr';

export default function AccessDenied() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-8">
                <div className="flex justify-center text-red-600">
                    <ShieldSlash size={72} weight="duotone" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-900">
                        Access Restricted
                    </h1>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                        Access to Cannoga University systems and portal accounts has been permanently restricted for this identity or IP address.
                    </p>
                    <p className="text-neutral-400 text-xs">
                        If you believe this is in error, please contact the admissions and registrar office.
                    </p>
                </div>

                <div className="pt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#0a151a] text-white px-8 py-4 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg active:scale-95"
                    >
                        <CaretLeft size={16} weight="bold" />
                        Return to Public Homepage
                    </Link>
                </div>
            </div>
        </main>
    );
}
