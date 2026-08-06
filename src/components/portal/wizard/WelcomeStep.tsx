'use client';

import { ProgrammeInstruction } from '@/utils/programme-instructions';
import { ArrowRight, Info, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@aalto-dx/react-components";

interface Props {
    instructions: ProgrammeInstruction;
    nextStepHref: string;
}

export default function WelcomeStep({ instructions, nextStepHref }: Props) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-8"> {/* Changed from space-y-4 to space-y-8 */}
                <div className="border border-neutral-100 p-6 rounded-sm text-[#2d2d2d]"> {/* New div structure */}
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl font-semibold text-neutral-900">
                            {instructions.welcomeMessage}
                        </h2>
                    </div>
                    <p className="text-black text-[13px] leading-relaxed font-medium opacity-80">
                        Please read the following instructions carefully before proceeding with your application.
                        Preparing your documents in advance will ensure a smooth process.
                    </p>
                </div>

                <div className="space-y-6 pt-4">
                    <h3 className="text-[13px] font-semibold text-black flex items-center gap-2 normal-case">
                        <Info size={14} weight="regular" />
                        Application Guidance
                    </h3>
                    <ul className="space-y-4">
                        {instructions.instructions.map((step, index) => (
                            <li key={index} className="flex items-start gap-3 group">
                                <ArrowRight size={16} weight="bold" className="text-black shrink-0 mt-1" />
                                <span className="text-[15px] text-black font-semibold leading-relaxed">
                                    {step}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-neutral-100 flex justify-end">
                <Link
                    href={nextStepHref}
                    className="flex items-center justify-center gap-2 bg-[#9c27b3] text-white px-8 py-4 rounded-sm text-[13px] font-bold normal-case hover:bg-neutral-800 transition-all text-center shadow-lg min-w-[200px]"
                >
                    Begin Application
                    <CaretRight size={16} weight="bold" />
                </Link>
            </div>
        </div>
    );
}

