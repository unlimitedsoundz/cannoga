import { Link } from "@aalto-dx/react-components";
import { CaretLeft } from '@phosphor-icons/react/dist/ssr';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-8">
                <h1 className="text-[120px] font-black leading-none tracking-tighter text-neutral-100 select-none">
                    404
                </h1>

                <div className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Page Not Found</h2>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                <div className="pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#9c27b3] text-white px-8 py-4 rounded-sm text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg active:scale-95"
                    >
                        <CaretLeft size={16} weight="bold" />
                        Back to Home
                    </Link>
                </div>

                <div className="pt-16 grid grid-cols-2 gap-4 text-left">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-2">Popular Links</p>
                        <ul className="space-y-1 text-xs font-bold uppercase tracking-tight">
                            <li><Link href="/admissions/" className="hover:underline">Admissions</Link></li>
                            <li><Link href="/schools/" className="hover:underline">Schools</Link></li>
                            <li><Link href="/news/" className="hover:underline">News</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-2">Support</p>
                        <ul className="space-y-1 text-xs font-bold uppercase tracking-tight">
                            <li><Link href="/contact/" className="hover:underline">Contact Us</Link></li>
                            <li><Link href="/student-guide/" className="hover:underline">Student Guide</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}

