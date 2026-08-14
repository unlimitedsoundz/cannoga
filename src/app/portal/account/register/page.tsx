'use client';

import { useState } from 'react';
import { Link } from "@aalto-dx/react-components";
import { Button } from "@aalto-dx/react-components";
import { Hero } from '@/components/layout/Hero';
import { Eye, EyeSlash } from "@phosphor-icons/react/dist/ssr";
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
        gender: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                gender: formData.gender
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

            <div className="cc-container max-w-xl mx-auto py-6">
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

                    <form onSubmit={handleRegister} className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Email Address <span className="text-red-600">*</span></label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Password <span className="text-red-600">*</span></label>
                            <div className="relative flex-1 w-full">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 pr-10 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
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

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">First Name <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Middle Name <span className="text-black font-normal">(Opt)</span></label>
                            <input
                                type="text"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                placeholder="Optional"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Last Name <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Passport No. <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="passportNumber"
                                required
                                value={formData.passportNumber}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Date of Birth <span className="text-red-600">*</span></label>
                            <div className="flex-1 w-full">
                                <DateSelector
                                    name="dateOfBirth"
                                    required
                                    value={formData.dateOfBirth}
                                    onChange={(name, value) => setFormData({ ...formData, [name]: value })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Gender <span className="text-red-600">*</span></label>
                            <select
                                name="gender"
                                required
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            >
                                <option value="">Select your gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Phone Code <span className="text-red-600">*</span></label>
                            <select
                                name="phoneCode"
                                required
                                value={formData.phoneCode}
                                onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            >
                                {phoneCodes.map((phone) => (
                                    <option key={phone.code} value={phone.code}>
                                        {phone.code} ({phone.country})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Phone Number <span className="text-red-600">*</span></label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                placeholder="e.g. 1234567890"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Citizenship <span className="text-red-600">*</span></label>
                            <select
                                name="citizenship"
                                required
                                value={formData.citizenship}
                                onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            >
                                <option value="">Select citizenship</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country.charAt(0).toUpperCase() + country.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Country <span className="text-red-600">*</span></label>
                            <select
                                name="country"
                                required
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            >
                                <option value="">Select country</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country.charAt(0).toUpperCase() + country.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Address <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                                placeholder="Street address"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">City <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="city"
                                required
                                value={formData.city}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">State/Province <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="state"
                                required
                                value={formData.state}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <label className="w-full sm:w-36 flex-shrink-0 text-[13px] font-black text-black sm:text-right">Zip/Postal Code <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="zipcode"
                                required
                                value={formData.zipcode}
                                onChange={handleChange}
                                className="flex-1 w-full px-3 py-1.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black text-[13px]"
                            />
                        </div>

                        <div className="pt-2 sm:pl-39">
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto px-8"
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