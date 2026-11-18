import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";

/**
 * Displays Cannoga College's Designated Learning Institution (DLI) status
 * and external verification link directly beneath hero sections.
 */
export function DliBanner() {
    return (
        <section aria-label="Designated Learning Institution Status" className="w-full container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#034737] text-white px-6 py-6 md:px-10 md:py-7 border-b border-[#034737]/20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2.5">
                    <div>
                        <span className="text-base sm:text-xl font-bold uppercase tracking-widest text-white">
                            Designated Learning Institution (DLI)
                        </span>
                    </div>
                    <p className="text-lg sm:text-xl text-white max-w-2xl leading-relaxed">
                        Cannoga College is an approved Designated Learning Institution in Ontario, Canada (DLI{" "}
                        <strong className="text-white font-semibold">O19387496264</strong>), authorized to welcome international students.
                    </p>
                </div>

                <div className="max-w-full">
                    <p className="text-base sm:text-xl font-bold uppercase tracking-wider text-white mb-2">
                        Official Government of Canada DLI List
                    </p>
                    <a
                        href="https://canadadli.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 !text-white hover:!text-white underline underline-offset-4 text-base sm:text-lg font-medium break-all transition-colors"
                    >
                        <span>https://canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html</span>
                        <ArrowSquareOut size={20} weight="bold" className="shrink-0 text-white" />
                    </a>
                </div>
            </div>
        </section>
    );
}
