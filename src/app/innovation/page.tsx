
import { RocketLaunch as Rocket, Lightbulb } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
    title: 'Center for Innovation & Entrepreneurial Support — Cannoga College',
    description: 'Discover student incubators, start-up mentoring programs, and collaborative research spaces at our Ottawa Innovation Hub.',
    alternates: {
        canonical: 'https://cannogacollege.ca/innovation/',
    },
};

export default function InnovationPage() {
    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="bg-[#0a151a] p-8 md:p-16 text-center text-white shadow-2xl">
                <h1 className="text-[36px] md:text-5xl lg:text-7xl font-bold mb-6 leading-tight pt-8 text-white">
                    Innovation Hub</h1>
                <p className="text-xl text-white max-w-2xl mx-auto">
                    Incubating the next generation of green technology startups. From classroom to market.
                </p>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-16 -mt-12">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 shadow-lg border border-neutral-100 transform hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center text-black mb-6">
                            <Rocket size={24} weight="regular" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Startup Incubator</h3>
                        <p className="text-neutral-600 mb-6">
                            A 12-week intensive program for student founders. Provides seed funding, mentorship from industry leaders, and office space.
                        </p>
                        <button className="text-black font-bold hover:opacity-80">Apply for Spring Batch →</button>
                    </div>

                    <div className="bg-white p-8 shadow-lg border border-neutral-100 transform hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-pink-100 flex items-center justify-center text-pink-600 mb-6">
                            <Lightbulb size={24} weight="regular" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Tech Transfer Office</h3>
                        <p className="text-neutral-600 mb-6">
                            Helping researchers commercialize their discoveries. We handle patenting, licensing, and corporate partnerships.
                        </p>
                        <button className="text-pink-600 font-bold hover:text-pink-800">Learn Process →</button>
                    </div>
                </div>

                <section className="mt-20">
                    <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900">Success Stories</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "EcoFibre", desc: "Sustainable textiles from wood pulp.", raised: "$2.5M Seed" },
                            { name: "WattShare", desc: "P2P energy trading platform.", raised: "$1.2M Pre-Seed" },
                            { name: "UrbanHarvest", desc: "Vertical farming automation.", raised: "Acquired" }
                        ].map((story) => (
                            <div key={story.name} className="text-center p-6 border border-neutral-100 bg-white">
                                <div className="w-16 h-16 bg-neutral-100 mx-auto mb-4 flex items-center justify-center font-bold text-neutral-500 text-xl border border-neutral-200">
                                    {story.name[0]}
                                </div>
                                <h4 className="text-xl font-bold text-neutral-900">{story.name}</h4>
                                <p className="text-neutral-500 text-sm mb-2">{story.desc}</p>
                                <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1">
                                    {story.raised}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
