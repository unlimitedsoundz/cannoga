
import { Link } from "@aalto-dx/react-components";
import Image from 'next/image';
import { Palette, Calendar, MapPin } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
    title: 'Creative Arts, Galleries & Student Showcases — Cannoga College',
    description: 'Discover upcoming art gallery viewings, design exhibitions, and creative projects by our students and faculty members in Ottawa.',
};

export default function ArtPage() {
    const exhibitions = [
        {
            title: "Nature & Synthesis",
            artist: "MFA Class of 2026",
            date: "Current Exhibition",
            image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Digital Landscapes",
            artist: "Elena K.",
            date: "Upcoming: Feb 15",
            image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Sustainable Sculptures",
            artist: "Group Exhibition",
            date: "Past: Dec 2025",
            image: "https://images.unsplash.com/photo-1516069904918-97836d5fc1d3?q=80&w=2048&auto=format&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a151a] text-white">
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-6xl font-light mb-4 pt-8">Cannoga<span className="font-bold">ART</span></h1>
                <p className="text-neutral-400 text-xl mb-16 max-w-2xl">
                    Where sustainability meets creativity. Exploring new mediums for environmental expression.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exhibitions.map((ex, idx) => (
                        <div key={idx} className="group cursor-pointer">
                            <div className="relative aspect-[3/4] overflow-hidden mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-700">
                                <Image
                                    src={ex.image}
                                    alt={ex.title}
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <span className="text-black text-sm hover:underline">View Gallery →</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-1 group-hover:text-neutral-500 transition-colors">{ex.title}</h3>
                            <p className="text-neutral-400 flex items-center gap-2">
                                <Palette size={14} weight="regular" />
                                {ex.artist}
                            </p>
                            <p className="text-xs text-neutral-600 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <Calendar size={12} weight="regular" />
                                {ex.date}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-24 border-t border-neutral-900 pt-12 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Upcoming Events</h2>
                    <Link href="/" className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2">
                        <MapPin size={16} weight="regular" />
                        View Calendar
                    </Link>
                </div>
            </div>
        </div>
    );
}


