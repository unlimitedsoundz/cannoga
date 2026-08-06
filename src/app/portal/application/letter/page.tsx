'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Application } from '@/types/database';
import { Link } from "@aalto-dx/react-components";
import { CaretLeft as ChevronLeft, CheckCircle, WarningCircle as AlertCircle } from "@phosphor-icons/react/dist/ssr";
import { formatToDDMMYYYY } from '@/utils/date';
import PrintButton from '@/components/portal/PrintButton';
import RejectOfferButton from './RejectOfferButton';
import Image from 'next/image';
import {
    getTuitionFee,
    mapSchoolToTuitionField,
    getProgramYears,
    calculateTuitionDeposit
} from '@/utils/tuition';
import { getIntakeStartDate, getProgramEndDate, getIntakeAcademicYear } from '@/lib/intakes';

interface EnrichedApplication extends Application {
    offer?: any[];
    admission_details?: any;
    user?: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      student_id?: string;
      date_of_birth?: string;
      address?: string;
      city?: string;
      country_of_residence?: string;
    };
    personal_info: {
      firstName: string;
      lastName: string;
      passportNumber?: string;
      dateOfBirth?: string;
      gender?: string;
      nationality?: string;
      streetAddress?: string;
      city?: string;
      country?: string;
      studentType?: string;
    };
}

function AdmissionLetterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState<EnrichedApplication | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchLetterData = async () => {
            if (!id) {
                router.push('/portal/dashboard');
                return;
            }

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/portal/account/login');
                    return;
                }

                const { data: applicationRaw, error } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        course:Course(*, school:School(*)),
                        user:profiles(*),
                        offer:admission_offers(*)
                    `)
                    .eq('id', id)
                    .eq('user_id', user.id)
                    .single();

                if (error || !applicationRaw) {
                    console.error('Letter data not found', error);
                    router.push('/portal/dashboard');
                    return;
                }

                const { data: admissionData } = await supabase
                    .from('admissions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('program', applicationRaw.course?.title)
                    .maybeSingle();

                setData({ ...applicationRaw, admission_details: admissionData });
            } catch (err) {
                console.error('CRITICAL: Fetching letter data failed', err);
                router.push('/portal/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchLetterData();
    }, [id, router, supabase]);

    const handleAcceptOffer = async () => {
        if (!id || !data) return;

        const confirmed = window.confirm(
            'Are you sure you want to accept this offer? This will finalize your admission process and proceed to tuition payment.'
        );

        if (!confirmed) return;

        setIsSaving(true);
        try {
            const { acceptApplicationOffer } = await import('@/app/portal/student/offer/actions');
            await acceptApplicationOffer(id, data.user?.id);

            window.location.href = `/portal/application/payment?id=${id}`;
        } catch (err: any) {
            console.error('Error accepting offer:', err);
            if (err.message?.includes('already') || err.message?.includes('not in a state')) {
                window.location.href = `/portal/application/payment?id=${id}`;
            } else {
                alert(err.message || 'Failed to accept offer. Please try again.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data || !id) return null;

    const application = data;

    const degreeLevelRaw = (application.course?.degreeLevel || '').toUpperCase();
    const degreeLevelLabel =
        degreeLevelRaw === 'MASTER' ? "Master's Degree"
            : degreeLevelRaw === 'BACHELOR' ? "Bachelor's Degree"
                : degreeLevelRaw === 'DIPLOMA' ? 'Ontario College Diploma'
                    : degreeLevelRaw === 'CERTICACATE' ? 'Ontario College Certificate'
                        : "Bachelor's Degree";

    let displayOffer = Array.isArray(data.offer) ? data.offer[0] : data.offer;
    displayOffer = displayOffer || {};

    const years = getProgramYears(application.course?.duration || '', application.course?.degreeLevel);
    const field = mapSchoolToTuitionField(application.course?.school?.slug || 'technology');

    const studentType = application.personal_info?.studentType;
    const isDomestic = studentType === 'domestic';

    const annualFee = getTuitionFee(application.course?.degreeLevel || 'BACHELOR', field, isDomestic);

    const depositAmount = calculateTuitionDeposit(annualFee, field, false, application.course?.degreeLevel, isDomestic);
    const remainingBalance = annualFee - depositAmount;

    const today = new Date();
    const showAcceptButton = application.status === 'ADMITTED';
    const admissionTimestamp = displayOffer?.accepted_at || displayOffer?.created_at || application.updated_at || application.submitted_at || application.created_at || today.toISOString();
    const dateOfIssue = formatToDDMMYYYY(admissionTimestamp);
    const expiryDate = new Date(admissionTimestamp);
    expiryDate.setMonth(expiryDate.getMonth() + 3);
    const expiryDateLabel = formatToDDMMYYYY(expiryDate.toISOString());

    const paymentDeadline = new Date(admissionTimestamp);
    paymentDeadline.setDate(paymentDeadline.getDate() + 30);
    const paymentDeadlineLabel = formatToDDMMYYYY(paymentDeadline.toISOString());

    const personalInfo = application.personal_info ?? { firstName: '', lastName: '', streetAddress: undefined, city: undefined, country: undefined };
    const contactDetails = application.contact_details ?? { addressLine1: '', addressLine2: '', city: undefined, country: undefined, streetAddress: undefined };
    const applicantFirstName = personalInfo.firstName || application.user?.first_name || '';
    const applicantLastName = personalInfo.lastName || application.user?.last_name || '';
    const applicantName = `${applicantFirstName} ${applicantLastName}`.trim() || 'Applicant';
    const applicantAddress = [
        contactDetails.addressLine1 || personalInfo.streetAddress || application.user?.address || '',
        contactDetails.addressLine2 || '',
        [contactDetails.city || personalInfo.city || application.user?.city, contactDetails.country || personalInfo.country || application.user?.country_of_residence].filter(Boolean).join(', ')
    ].filter(Boolean).join(', ') || 'Address Pending';

    const programStart = getIntakeStartDate(application.intake);
    const programEnd = getProgramEndDate(application.intake, application.course?.degreeLevel);
    const programLength = `${years} Year${years > 1 ? 's' : ''}`;
    const credential = degreeLevelLabel;
    const levelOfStudy = degreeLevelRaw === 'MASTER' ? 'Level 7' : degreeLevelRaw === 'BACHELOR' ? 'Level 6' : 'Level 5';
    const hoursOfInstruction = degreeLevelRaw === 'MASTER' ? '1,800' : degreeLevelRaw === 'BACHELOR' ? '2,400' : '1,200';

    const tuitionFee = annualFee;
    const mandatoryFees = 700;
    const totalAnnualFees = tuitionFee + mandatoryFees;

    const totalDue1 = totalAnnualFees;
    const totalDue2 = Math.round(totalDue1 * 0.5);
    const totalDue3 = totalDue1 - totalDue2;

    const schoolType = application.course?.school?.slug === 'business' ? 'Private' : 'Private';

    return (
        <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6">
            {/* Control Bar (Hidden on Print) */}
            <div className="max-w-[210mm] mx-auto mb-2 md:mb-6 print:hidden space-y-2 md:space-y-0">
                <div className="flex items-center justify-between">
                    <Link
                        href="/portal/dashboard"
                        className="flex items-center gap-1 text-[12px] md:text-[14px] font-bold uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors"
                    >
                        <ChevronLeft size={14} weight="bold" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                    <PrintButton />
                </div>
                {showAcceptButton && (
                    <div className="grid grid-cols-2 gap-2 md:flex md:gap-3">
                        <button
                            onClick={handleAcceptOffer}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-1 bg-neutral-600 text-white px-3 md:px-6 py-2 rounded-sm text-[14px] font-bold uppercase tracking-wider md:tracking-widest hover:bg-neutral-700 transition-all shadow-sm disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <CheckCircle size={14} weight="bold" />
                            )}
                            Accept<span className="hidden md:inline"> Offer</span>
                        </button>
                        <RejectOfferButton applicationId={id} />
                    </div>
                )}
            </div>

            {/* Letter Container */}
            <div id="letter-of-acceptance" className="w-full max-w-[210mm] mx-auto bg-white shadow-xl print:shadow-none min-h-[297mm] p-3 md:p-[12mm] print:p-[8mm] relative overflow-hidden text-black border border-neutral-200 print:border-gray-300" style={{ fontFamily: "'Sequel Sans', Arial, sans-serif" }}>

                {/* PAGE 1 */}
                <div className="print:break-inside-avoid">
                    {/* Header - Logo Right, Title/Date Left */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-2">
                        <div className="text-left">
                            <h2 className="text-lg font-bold text-black uppercase tracking-[0.15em] mb-1">Letter of Acceptance</h2>
                            <p className="text-[14px] text-black">Date of Issue: {dateOfIssue}</p>
                        </div>
                        <div className="text-left md:text-right">
                            <Image
                                src="/images/logo-cannoga.png"
                                alt="Cannoga College Official Logo"
                                width={120}
                                height={33}
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Intro */}
                    <div className="mb-2 text-left">
                        <p className="text-sm font-bold text-black">Congratulations! You have been accepted to Cannoga College.</p>
                    </div>

                    {/* Personal Information Table */}
                    <div className="mb-2 overflow-x-auto">
                        <h3 className="text-base font-bold text-black uppercase tracking-widest mb-1">Personal Information</h3>
                        <table className="w-full border border-black text-[14px] border-collapse min-w-[300px]">
                            <tbody>
                                <tr>
                                    <td className="border border-black p-1 w-1/2 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Family name</div>
                                        <div className="text-black">{applicantLastName || '-'}</div>
                                    </td>
                                    <td className="border border-black p-1 w-1/2 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Given name</div>
                                        <div className="text-black capitalize">{applicantFirstName || '-'}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Date of birth</div>
                                        <div className="text-black">{formatToDDMMYYYY(application.user?.date_of_birth || personalInfo.dateOfBirth || '')}</div>
                                    </td>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Student ID #</div>
                                        <div className="text-black">{application.user?.student_id || application.id.slice(0, 8).toUpperCase()}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">CAQ</div>
                                        <div className="text-black">Not Applicable</div>
                                    </td>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Student's full mailing address</div>
                                        <div className="text-black">{applicantAddress}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top" colSpan={2}>
                                        <div className="text-[12px] font-bold text-black mb-0.5">Recruiting/Admissions representative (if applicable)</div>
                                        <div className="text-black">-</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Institution Information Table */}
                    <div className="mb-2">
                        <h3 className="text-base font-bold text-black uppercase tracking-widest mb-1">Institution Information</h3>
                        <table className="w-full border border-black text-[14px] border-collapse">
                            <tbody>
                                <tr>
                                    <td className="border border-black p-1 w-1/3 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Name of contact</div>
                                        <div className="text-black">International Admissions and Records Office</div>
                                    </td>
                                    <td className="border border-black p-1 w-1/3 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Phone</div>
                                        <div className="text-black">+1 (613) 555-0181</div>
                                    </td>
                                    <td className="border border-black p-1 w-1/3 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Email</div>
                                        <div className="text-black">admissions@cannogacollege.ca</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top" colSpan={3}>
                                        <div className="text-[12px] font-bold text-black mb-0.5">Full name and address of institution</div>
                                        <div className="text-black">Cannoga College, 81 Montreal Road, Ottawa, Ontario, K1L 6E8, Canada</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Type of school/institution</div>
                                        <div className="text-black">{schoolType}</div>
                                    </td>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Website</div>
                                        <div className="text-black">cannogacollege.ca</div>
                                    </td>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Designated learning institution (DLI) number</div>
                                        <div className="text-black">O22203958882</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Program Information Table */}
                    <div className="mb-2 overflow-x-auto">
                        <h3 className="text-base font-bold text-black uppercase tracking-widest mb-1">Program Information</h3>
                        <table className="w-full border border-black text-[14px] border-collapse min-w-[300px]">
                            <tbody>
                                <tr>
                                    <td className="border border-black p-1 w-1/2 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Academic status</div>
                                        <div className="text-black">Full-Time</div>
                                    </td>
                                    <td className="border border-black p-1 w-1/2 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Program of study</div>
                                        <div className="text-black">{application.course?.title || '-'}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Program code</div>
                                        <div className="text-black">{application.course?.slug || '-'}</div>
                                    </td>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Campus</div>
                                        <div className="text-black">Ottawa</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Program length</div>
                                        <div className="text-black">{programLength}</div>
                                    </td>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Start Date</div>
                                        <div className="text-black">{programStart}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Approx. Completion Date</div>
                                        <div className="text-black">{programEnd}</div>
                                    </td>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Credential</div>
                                        <div className="text-black">{credential}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Level of Study</div>
                                        <div className="text-black">{levelOfStudy}</div>
                                    </td>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Hours of Instruction</div>
                                        <div className="text-black">{hoursOfInstruction}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Exchange Program</div>
                                        <div className="text-black">No</div>
                                    </td>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Internship/Work Practicum</div>
                                        <div className="text-black">Available</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Fee Structure */}
                    <div className="mb-2 overflow-x-auto">
                        <h3 className="text-base font-bold text-black uppercase tracking-widest mb-1">Fee Structure</h3>
                        <table className="w-full border border-black text-[14px] border-collapse min-w-[300px]">
                            <tbody>
                                <tr>
                                    <td className="border border-black p-1 font-bold text-black">Tuition Fees</td>
                                    <td className="border border-black p-1 text-right text-black">${tuitionFee.toLocaleString()} CAD</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 font-bold text-black">Mandatory Fees</td>
                                    <td className="border border-black p-1 text-right text-black">${mandatoryFees.toLocaleString()} CAD</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 font-bold text-black">Total Annual Fees</td>
                                    <td className="border border-black p-1 text-right text-black">${totalAnnualFees.toLocaleString()} CAD</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-1 text-[12px] text-black font-medium space-y-0.5">
                            <div><strong>TOTAL DUE:</strong> ${totalDue1.toLocaleString()} CAD by {paymentDeadlineLabel}</div>
                            <div>${totalDue2.toLocaleString()} CAD by {paymentDeadlineLabel}</div>
                            <div>${totalDue3.toLocaleString()} CAD by {expiryDateLabel}</div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mb-2 overflow-x-auto">
                        <h3 className="text-base font-bold text-black uppercase tracking-widest mb-1">Additional Information</h3>
                        <table className="w-full border border-black text-[14px] border-collapse min-w-[300px]">
                            <tbody>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Scholarship/Teaching Assistantship/Other Financial Aid</div>
                                        <div className="text-black">-</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Conditions of Acceptance</div>
                                        <ul className="list-disc ml-4 mt-0.5 space-y-0.5">
                                            <li>Formal acceptance of this offer via the student portal.</li>
                                            <li>Payment of required tuition deposit by the specified deadline.</li>
                                            <li>Submission of any outstanding original documents (if applicable).</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1 align-top">
                                        <div className="text-[12px] font-bold text-black mb-0.5">Expiry of Letter of Acceptance</div>
                                        <div className="text-black">{expiryDateLabel}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Important Note Box */}
                    <div className="mb-2 p-2 border border-black">
                        <h4 className="text-[12px] font-bold text-black uppercase tracking-widest mb-0.5">Important Note</h4>
                        <p className="text-[12px] text-black leading-relaxed">
                            Tuition and fees are subject to the institution's official fee schedule. Payment deadlines are listed in the applicant's official offer. Applicable deposits and fees are subject to the college's refund policy. Scholarships, bursaries, and financial awards are subject to their applicable terms and conditions.
                        </p>
                    </div>

                    {/* Registrar Sign-off - REMOVED FROM PAGE 1, MOVED TO PAGE 2 */}
                </div>

                {/* PAGE 2 */}
                <div className="mt-4 pt-2 print:break-before-page">
                    {/* Section: To Accept This Letter */}
                    <div className="mb-2">
                        <h3 className="text-[14px] font-bold text-black uppercase tracking-widest mb-1">To Accept This Letter of Acceptance</h3>
                        <ol className="list-decimal ml-5 text-[14px] text-black space-y-1 leading-relaxed">
                            <li>Acceptance is confirmed through the official Cannoga College admissions process. Any required payment must be made through the institution's authorized payment channel. Do not send cash or personal cheques by mail.</li>
                            <li>Applicants must complete all required documentation through the official applicant portal by the specified deadline. Incomplete submissions may delay processing.</li>
                            <li>Orientation requirements will be communicated to your student email account prior to the start of the program. Attendance is mandatory for all new students.</li>
                        </ol>
                    </div>

                    {/* Payment Options for International Students */}
                    <div className="mb-2">
                        <h3 className="text-[14px] font-bold text-black uppercase tracking-widest mb-1">Payment Options for International Students</h3>
                        <p className="text-[14px] text-black leading-relaxed mb-1">International students should use only payment methods officially authorized by Cannoga College. The following options are available:</p>
                        <ol className="list-decimal ml-5 text-[14px] text-black space-y-0.5 leading-relaxed">
                            <li><strong>Online payment:</strong> Through the official Cannoga College student portal using a certified payment provider.</li>
                            <li><strong>Bank transfer:</strong> Contact the Admissions Office for official banking instructions. Do not transfer funds to personal accounts.</li>
                            <li><strong>Other authorized method:</strong> As specified by the Finance Office in your official invoice.</li>
                        </ol>
                    </div>

                    {/* Payment Options for Students in Canada */}
                    <div className="mb-2">
                        <h3 className="text-[14px] font-bold text-black uppercase tracking-widest mb-1">Payment Options for Students in Canada</h3>
                        <ul className="list-disc ml-5 text-[14px] text-black space-y-0.5 leading-relaxed">
                            <li>Online payment through the official student portal.</li>
                            <li>Authorized bank payment at a recognized financial institution.</li>
                            <li>Other methods officially supported by Cannoga College.</li>
                        </ul>
                    </div>

                    {/* Student Portal */}
                    <div className="mb-2">
                        <h3 className="text-[14px] font-bold text-black uppercase tracking-widest mb-1">Cannoga College Student Portal</h3>
                        <p className="text-[14px] text-black leading-relaxed mb-0.5">Students can use the official portal to:</p>
                        <ul className="list-disc ml-5 text-[14px] text-black space-y-0.5 leading-relaxed mb-1">
                            <li>Review admission information.</li>
                            <li>Submit required documents.</li>
                            <li>Monitor application status.</li>
                            <li>Review tuition information.</li>
                            <li>Access registration information.</li>
                        </ul>
                        <p className="text-[14px] text-black">Portal URL: <span className="font-bold">portal.cannogacollege.ca</span></p>
                    </div>

                    {/* Program Requirements */}
                    <div className="mb-2">
                        <h3 className="text-[14px] font-bold text-black uppercase tracking-widest mb-1">Program Requirements</h3>
                        <p className="text-[14px] text-black leading-relaxed">Program-specific requirements must be completed before enrollment where applicable. These may include:</p>
                        <ul className="list-disc ml-5 text-[14px] text-black space-y-0.5 leading-relaxed mt-0.5">
                            <li>Academic documentation (transcripts, certificates).</li>
                            <li>English-language requirements (IELTS, TOEFL, or equivalent).</li>
                            <li>Prerequisite courses or bridging programs.</li>
                            <li>Identity documentation (valid passport).</li>
                            <li>Other program-specific requirements as specified in your offer.</li>
                        </ul>
                    </div>

                    {/* Canadian Study Permit */}
                    <div className="mb-2">
                        <h3 className="text-[14px] font-bold text-black uppercase tracking-widest mb-1">Canadian Study Permit</h3>
                        <p className="text-[14px] text-black leading-relaxed mb-1">International students who require a Canadian study permit are responsible for applying through the appropriate Government of Canada process. Admission to Cannoga College does not guarantee approval of a study permit.</p>
                        <p className="text-[14px] text-black">Official Government of Canada immigration information: <span className="font-bold">canada.ca/en/immigration-refugees-citizenship/services/study-canada.html</span></p>
                    </div>

                    {/* Closing */}
                    <div className="mt-2 pt-2">
                        <p className="text-[14px] text-black leading-relaxed mb-2">We look forward to welcoming you to Cannoga College.</p>
                        <div className="flex items-end justify-between">
                            <div className="text-[14px] text-black text-left">
                                <p className="font-bold">Sincerely,</p>
                                <p className="font-bold mt-1">Todd Banning</p>
                                <p className="font-bold">Registrar | Cannoga College</p>
                            </div>
                            <div className="w-40 h-12 relative">
                                <Image
                                    src="/images/official-signature.png"
                                    alt="Official Signature"
                                    fill
                                    style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 10mm; size: A4; }
                    body { background: white !important; padding: 0 !important; margin: 0 !important; }

                    header, nav, footer,
                    [data-theme="portal"] > header,
                    [data-theme="portal"] > footer,
                    .print\\:hidden { display: none !important; }

                    [data-theme="portal"] { min-height: 0 !important; }
                    [data-theme="portal"] > main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
                    .min-h-screen { min-height: 0 !important; background: white !important; padding: 0 !important; }
                    .min-h-\\[297mm\\] { min-height: 0 !important; }

                    .max-w-\\[210mm\\] { max-width: 100% !important; margin: 0 !important; padding: 10mm 0 !important; }
                    .shadow-xl, .print\\:shadow-none { box-shadow: none !important; }
                    .print\\:border-0 { border: none !important; }

                    * { color: black !important; }
                    a { text-decoration: none !important; }

                    #letter-of-acceptance,
                    #letter-of-acceptance * {
                        font-family: 'Sequel Sans', Arial, sans-serif !important;
                    }
                }

                #letter-of-acceptance,
                #letter-of-acceptance * {
                    font-family: 'Sequel Sans', Arial, sans-serif !important;
                }
            ` }} />
        </div>
    );
}

export default function AdmissionLetterPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-black rounded-full animate-spin"></div>
            </div>
        }>
            <AdmissionLetterContent />
        </Suspense>
    );
}
