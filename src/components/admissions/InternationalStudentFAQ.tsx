'use client';

import { useState } from 'react';
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";

interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

const faqs: FAQItem[] = [
    {
        question: "Is orientation mandatory?",
        answer: (
            <div className="space-y-4">
                <p>
                    Yes, it provides essential info for starting your studies. All students are expected to attend the sessions during the first week.
                </p>
            </div>
        )
    },
    {
        question: "Do I need a study permit before arriving?",
        answer: (
            <div className="space-y-4">
                <p>
                    If you are an international student, you must apply for a Canadian study permit immediately after accepting your admission offer. Canada citizens and Nordic residents do not require a study permit but should complete enrolment through the student portal.
                </p>
            </div>
        )
    },
    {
        question: "How do I find housing in Ottawa, Ontario, Canada?",
        answer: (
            <div className="space-y-4">
                <p>
                    You should arrange accommodation before arrival. We recommend you apply for housing in your student portal when enrolled as "Attending".
                </p>
            </div>
        )
    },
    {
        question: "Am I allowed to work while studying?",
        answer: (
            <div className="space-y-4">
                <p>
                    Yes, international students are generally allowed to work part-time (typically up to 30 hours per week on average) during their studies.
                </p>
            </div>
        )
    },
    {
        question: "What kind of healthcare is available for students?",
        answer: (
            <div className="space-y-4">
                <p>
                    Attending degree students have access to on-campus health services and are encouraged to obtain Canadian health coverage (OHIP or private insurance) after arrival. Cannoga College partners with local clinics for general, mental, and oral health care.
                </p>
            </div>
        )
    },
                {
        question: "Do I need to speak Canadian or Swedish to live in Ottawa?",
        answer: (
            <div className="space-y-4">
                <p>
                    English is the primary language of instruction and daily life in Ottawa. While Ottawa is a bilingual city with Canadian and Swedish, all university programmes and services are fully available in English. Learning Canadian or Swedish is a bonus but not required.
                </p>
            </div>
        )
    },
    {
        question: "Can I bring my family?",
        answer: (
            <div className="space-y-4">
                <p>
                    Yes, family members can apply for study permits based on family ties. However, the student permit applicant must demonstrate sufficient financial resources for the entire family's stay.
                </p>
            </div>
        )
    }
];

export default function InternationalStudentFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-0">
            {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all mb-4 overflow-hidden">
                     <button
                         onClick={() => toggle(index)}
                         className="w-full flex items-center justify-between py-6 px-6 text-left hover:bg-[#0f2027]/5 transition-colors focus:outline-none group"
                     >
                         <span className="text-lg font-bold text-black">{faq.question}</span>
                         {openIndex === index ? (
                             <div className="bg-[#0f2027] text-white p-1.5 rounded-full shrink-0">
                                 <Minus size={20} weight="bold" />
                             </div>
                         ) : (
                             <div className="bg-[#0f2027]/10 text-black p-1.5 rounded-full shrink-0 group-hover:bg-[#0f2027]/20 transition-colors">
                                 <Plus className="group-hover:scale-110 transition-transform" size={20} weight="bold" />
                             </div>
                         )}
                     </button>
                     <div
                         className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[1000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                             } overflow-hidden`}
                     >
                         <div className="text-black leading-relaxed px-6 border-t border-[#0f2027]/10 pt-6">
                             {faq.answer}
                         </div>
                     </div>
                </div>
            ))}
        </div>
    );
}

