'use client';

import { useState } from 'react';
import { Link } from "@aalto-dx/react-components";
import { Button } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import { Eye, EyeSlash, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { registerApplicant } from '../actions';
import DateSelector from '@/components/ui/DateSelector';
import { countries } from '@/data/country-requirements';

const phoneCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+61', country: 'Australia' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+81', country: 'Japan' },
    { code: '+82', country: 'South Korea' },
    { code: '+55', country: 'Brazil' },
    { code: '+52', country: 'Mexico' },
    { code: '+63', country: 'Philippines' },
    { code: '+234', country: 'Nigeria' },
    { code: '+92', country: 'Pakistan' },
    { code: '+66', country: 'Thailand' },
    { code: '+84', country: 'Vietnam' },
    { code: '+20', country: 'Egypt' },
    { code: '+971', country: 'UAE' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+90', country: 'Turkey' },
];

const canadianProvinces = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Northwest Territories',
    'Nunavut',
    'Yukon'
];

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        password: '',
        phoneCode: '+1',
        phoneNumber: '',
        citizenship: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        passportNumber: '',
        gender: '',
        sameAsAbove: false,
        localAddress: '',
        localCity: '',
        localCountry: '',
        localState: '',
        localZipcode: '',
        is19OrOlder: '',
        contactFirstName: '',
        contactLastName: '',
        contactPhone: '',
        contactEmail: '',
        hasSiblingsAtCollege: '',
        completingFormPerson: '',
        housingRequired: '',
        howDidYouHear: '',
        questionsComments: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (prev.sameAsAbove) {
                if (name === 'address') updated.localAddress = value;
                if (name === 'city') updated.localCity = value;
                if (name === 'country') updated.localCountry = value;
                if (name === 'state') updated.localState = value;
                if (name === 'zipcode') updated.localZipcode = value;
            }
            return updated;
        });
    };

    const handleSameAsAboveToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setFormData((prev) => ({
            ...prev,
            sameAsAbove: checked,
            localAddress: checked ? prev.address : prev.localAddress,
            localCity: checked ? prev.city : prev.localCity,
            localCountry: checked ? prev.country : prev.localCountry,
            localState: checked ? prev.state : prev.localState,
            localZipcode: checked ? prev.zipcode : prev.localZipcode
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const applicantData = {
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                country: formData.country,
                email: formData.email,
                dateOfBirth: formData.dateOfBirth,
                password: formData.password,
                phoneCode: formData.phoneCode,
                phoneNumber: formData.phoneNumber,
                citizenship: formData.citizenship,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipcode: formData.zipcode,
                passportNumber: formData.passportNumber,
                gender: formData.gender,
                sameAsAbove: formData.sameAsAbove,
                localAddress: formData.localAddress,
                localCity: formData.localCity,
                localCountry: formData.localCountry,
                localState: formData.localState,
                localZipcode: formData.localZipcode,
                is19OrOlder: formData.is19OrOlder,
                contactFirstName: formData.contactFirstName,
                contactLastName: formData.contactLastName,
                contactPhone: formData.contactPhone,
                contactEmail: formData.contactEmail,
                hasSiblingsAtCollege: formData.hasSiblingsAtCollege,
                completingFormPerson: formData.completingFormPerson,
                housingRequired: formData.housingRequired,
                howDidYouHear: formData.howDidYouHear,
                questionsComments: formData.questionsComments
            };
            const result = await registerApplicant(applicantData);

            if (result.error) {
                throw new Error(result.error);
            }

            window.location.href = '/portal/dashboard';
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to create account.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Hero
                title="Create Your Cannoga College Account"
                body="Start your application to Cannoga College by creating an account."
                backgroundColor="#000000"
                tinted
                lightText={true}
                image={{ src: '/images/international-students-hero.png', alt: 'Students at Cannoga College' }}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Portal', href: '/portal' }, { label: 'Register' }]}
            />

            <div className="cc-container max-w-2xl mx-auto py-6">
                {message && (
                    <div className={`p-3 rounded-sm mb-4 text-[13px] font-bold border ${message.type === 'success' ? 'bg-neutral-50 text-black border-neutral-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                    <h1 className="text-xl font-bold mb-1.5 text-black">Register New Account</h1>

                    <div className="mb-4 text-[13px] text-black leading-snug space-y-0.5 font-medium">
                        <p>
                            Cannoga College has two intakes each year for academic programs: Winter Semester (January) and Fall Semester (September). Students are recommended to apply at least 2-3 months before the start of the program. Our application deadlines for international students are:
                        </p>
                        <ul className="list-disc list-inside space-y-0">
                            <li>Deadline for 2026 Fall Semester: June 2026</li>
                            <li>Deadline for 2027 Winter Semester: November 2026</li>
                        </ul>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Section 1: Account Credentials */}
                        <div className="space-y-3">
                            <h2 className="bg-neutral-100 text-black text-[13px] font-bold px-3 py-1.5 rounded-md mb-3 border border-neutral-200/60">Account Credentials</h2>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Email Address <span className="text-red-600">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Password <span className="text-red-600">*</span></label>
                                <div className="relative w-full max-w-[400px]">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full h-[35px] px-3 pr-10 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                        placeholder="Minimum 6 characters"
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Personal Information */}
                        <div className="pt-4 border-t border-neutral-100 space-y-3">
                            <h2 className="bg-neutral-100 text-black text-[13px] font-bold px-3 py-1.5 rounded-md mb-3 border border-neutral-200/60">Personal Information</h2>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">First Name <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Middle Name <span className="text-black font-normal">(Opt)</span></label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Last Name <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Passport No. <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="passportNumber"
                                    required
                                    value={formData.passportNumber}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Date of Birth <span className="text-red-600">*</span></label>
                                <div className="w-full max-w-[400px]">
                                    <DateSelector
                                        name="dateOfBirth"
                                        required
                                        value={formData.dateOfBirth}
                                        onChange={(name, value) => setFormData({ ...formData, [name]: value })}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right pt-0.5">Gender <span className="text-red-600">*</span></label>
                                <div className="flex flex-col gap-1.5 max-w-[400px]">
                                    <label className="flex items-center gap-2 text-[13px] text-black font-normal cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            required
                                            value="Male"
                                            checked={formData.gender === 'Male'}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-black cursor-pointer"
                                        />
                                        Male
                                    </label>
                                    <label className="flex items-center gap-2 text-[13px] text-black font-normal cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            required
                                            value="Female"
                                            checked={formData.gender === 'Female'}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-black cursor-pointer"
                                        />
                                        Female
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Citizenship <span className="text-red-600">*</span></label>
                                <div className="relative w-full max-w-[400px]">
                                    <select
                                        name="citizenship"
                                        required
                                        value={formData.citizenship}
                                        onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                                        className="w-full h-[35px] pl-3 pr-8 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="">Select citizenship</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>
                                                {country.charAt(0).toUpperCase() + country.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Contact & Permanent Address */}
                        <div className="pt-4 border-t border-neutral-100 space-y-3">
                            <h2 className="bg-neutral-100 text-black text-[13px] font-bold px-3 py-1.5 rounded-md mb-3 border border-neutral-200/60">Contact & Permanent Address</h2>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Phone Code <span className="text-red-600">*</span></label>
                                <div className="relative w-full max-w-[400px]">
                                    <select
                                        name="phoneCode"
                                        required
                                        value={formData.phoneCode}
                                        onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                                        className="w-full h-[35px] pl-3 pr-8 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none cursor-pointer"
                                    >
                                        {phoneCodes.map((phone) => (
                                            <option key={phone.code} value={phone.code}>
                                                {phone.code} ({phone.country})
                                            </option>
                                        ))}
                                    </select>
                                    <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Phone Number <span className="text-red-600">*</span></label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                    placeholder="e.g. 1234567890"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Address <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                    placeholder="Street address"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">City <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Country <span className="text-red-600">*</span></label>
                                <div className="relative w-full max-w-[400px]">
                                    <select
                                        name="country"
                                        required
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full h-[35px] pl-3 pr-8 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="">Select country</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>
                                                {country.charAt(0).toUpperCase() + country.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">State/Province <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Zip/Postal Code <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="zipcode"
                                    required
                                    value={formData.zipcode}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                />
                            </div>
                        </div>

                        {/* Section 4: Local/Canadian Address Section */}
                        <div className="pt-4 border-t border-neutral-100">
                            <h2 className="bg-neutral-100 text-black text-[13px] font-bold px-3 py-1.5 rounded-md mb-3 border border-neutral-200/60">Local/Canadian Address (if known)</h2>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-3">
                                <div className="w-full sm:w-36 flex-shrink-0"></div>
                                <label className="flex items-center gap-2 text-[13px] text-black cursor-pointer font-normal">
                                    <input
                                        type="checkbox"
                                        name="sameAsAbove"
                                        checked={formData.sameAsAbove}
                                        onChange={handleSameAsAboveToggle}
                                        className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black accent-black cursor-pointer"
                                    />
                                    Same as above
                                </label>
                            </div>

                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                    <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Local Street Address</label>
                                    <input
                                        type="text"
                                        name="localAddress"
                                        disabled={formData.sameAsAbove}
                                        value={formData.localAddress}
                                        onChange={handleChange}
                                        className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] disabled:bg-neutral-100 disabled:text-neutral-500"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                    <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">City</label>
                                    <input
                                        type="text"
                                        name="localCity"
                                        disabled={formData.sameAsAbove}
                                        value={formData.localCity}
                                        onChange={handleChange}
                                        className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] disabled:bg-neutral-100 disabled:text-neutral-500"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                    <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Country</label>
                                    <div className="relative w-full max-w-[400px]">
                                        <select
                                            name="localCountry"
                                            disabled={formData.sameAsAbove}
                                            value={formData.localCountry}
                                            onChange={handleChange}
                                            className="w-full h-[35px] pl-3 pr-8 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none cursor-pointer disabled:bg-neutral-100 disabled:text-neutral-500"
                                        >
                                            <option value="">-- Select Country --</option>
                                            {countries.map((country) => (
                                                <option key={`local-${country}`} value={country}>
                                                    {country.charAt(0).toUpperCase() + country.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                    <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Province / State</label>
                                    <div className="relative w-full max-w-[400px]">
                                        <select
                                            name="localState"
                                            disabled={formData.sameAsAbove}
                                            value={formData.localState}
                                            onChange={handleChange}
                                            className="w-full h-[35px] pl-3 pr-8 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none cursor-pointer disabled:bg-neutral-100 disabled:text-neutral-500"
                                        >
                                            <option value="">-- Select Province / State --</option>
                                            {canadianProvinces.map((prov) => (
                                                <option key={prov} value={prov}>{prov}</option>
                                            ))}
                                        </select>
                                        <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                    <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Postal / Zip Code</label>
                                    <input
                                        type="text"
                                        name="localZipcode"
                                        disabled={formData.sameAsAbove}
                                        value={formData.localZipcode}
                                        onChange={handleChange}
                                        className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] disabled:bg-neutral-100 disabled:text-neutral-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Guardian / Emergency Contact & Additional Details */}
                        <div className="pt-4 border-t border-neutral-100 space-y-3">
                            <h2 className="bg-neutral-100 text-black text-[13px] font-bold px-3 py-1.5 rounded-md mb-3 border border-neutral-200/60">Guardian or Emergency Contact Information</h2>

                            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right pt-0.5">Are you 19 Years Old or Older? <span className="text-red-600">*</span></label>
                                <div className="flex flex-col gap-2 max-w-[400px]">
                                    <label className="flex items-center gap-2 text-[13px] text-black font-normal cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is19OrOlder"
                                            required
                                            value="Yes"
                                            checked={formData.is19OrOlder === 'Yes'}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-black cursor-pointer"
                                        />
                                        Yes, please provide Emergency Contact Information
                                    </label>
                                    <label className="flex items-center gap-2 text-[13px] text-black font-normal cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is19OrOlder"
                                            required
                                            value="No"
                                            checked={formData.is19OrOlder === 'No'}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-black cursor-pointer"
                                        />
                                        No, please provide Parents or Guardian Contact Information.
                                    </label>
                                </div>
                            </div>

                            {formData.is19OrOlder && (
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                        <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                                            {formData.is19OrOlder === 'Yes' ? 'Emergency Contact' : 'Parent/Guardian'} First Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="contactFirstName"
                                            required
                                            value={formData.contactFirstName}
                                            onChange={handleChange}
                                            className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                        <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                                            {formData.is19OrOlder === 'Yes' ? 'Emergency Contact' : 'Parent/Guardian'} Last Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="contactLastName"
                                            required
                                            value={formData.contactLastName}
                                            onChange={handleChange}
                                            className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                        <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                                            {formData.is19OrOlder === 'Yes' ? 'Emergency Contact' : 'Parent/Guardian'} Phone <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            required
                                            value={formData.contactPhone}
                                            onChange={handleChange}
                                            className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                            placeholder="e.g. 1234567890"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                        <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">
                                            {formData.is19OrOlder === 'Yes' ? 'Emergency Contact' : 'Parent/Guardian'} Email <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            required
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            className="w-full max-w-[400px] h-[35px] px-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                            placeholder="contact@example.com"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Siblings at Cannoga College?</label>
                                <div className="relative w-full max-w-[400px]">
                                    <select
                                        name="hasSiblingsAtCollege"
                                        value={formData.hasSiblingsAtCollege}
                                        onChange={handleChange}
                                        className="w-full h-[35px] pl-3 pr-8 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="">-- Select Option --</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                    <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">Who is completing this form? <span className="text-red-600">*</span></label>
                                <div className="relative w-full max-w-[400px]">
                                    <select
                                        name="completingFormPerson"
                                        required
                                        value={formData.completingFormPerson}
                                        onChange={handleChange}
                                        className="w-full h-[35px] pl-3 pr-8 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="">-- Select Option --</option>
                                        <option value="Applicant">Applicant (Self)</option>
                                        <option value="Parent / Guardian">Parent / Guardian</option>
                                        <option value="Educational Agent">Educational Agent</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right pt-0.5">Housing Requirements</label>
                                <div className="flex flex-col gap-1.5 max-w-[400px]">
                                    <label className="flex items-center gap-2 text-[13px] text-black font-normal cursor-pointer">
                                        <input
                                            type="radio"
                                            name="housingRequired"
                                            value="Required"
                                            checked={formData.housingRequired === 'Required'}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-black cursor-pointer"
                                        />
                                        Required
                                    </label>
                                    <label className="flex items-center gap-2 text-[13px] text-black font-normal cursor-pointer">
                                        <input
                                            type="radio"
                                            name="housingRequired"
                                            value="Not required"
                                            checked={formData.housingRequired === 'Not required'}
                                            onChange={handleChange}
                                            className="w-4 h-4 accent-black cursor-pointer"
                                        />
                                        Not required
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right">How did you hear about us?</label>
                                <div className="relative w-full max-w-[400px]">
                                    <select
                                        name="howDidYouHear"
                                        value={formData.howDidYouHear}
                                        onChange={handleChange}
                                        className="w-full h-[35px] pl-3 pr-8 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="">-- Select Option --</option>
                                        <option value="Social Media">Social Media (Instagram, Facebook, LinkedIn, TikTok)</option>
                                        <option value="Search Engine">Search Engine (Google, Bing)</option>
                                        <option value="Friends or Family">Friends or Family</option>
                                        <option value="Educational Agent">Educational Agent</option>
                                        <option value="Education Fair">Education Fair / Event</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <CaretDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-normal text-black sm:text-right pt-2">Questions?</label>
                                <textarea
                                    name="questionsComments"
                                    rows={2}
                                    value={formData.questionsComments}
                                    onChange={handleChange}
                                    className="w-full max-w-[400px] p-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px] resize-none"
                                    placeholder="Any questions or additional notes..."
                                />
                            </div>
                        </div>

                        <div className="pt-2 sm:pl-39">
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto px-8 h-[35px]"
                            >
                                {isLoading ? 'Creating Account...' : 'Register'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
                        <p className="text-[13px] text-black">
                            Already have an account?{' '}
                            <Link href="/portal/account/login" className="text-black font-bold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}