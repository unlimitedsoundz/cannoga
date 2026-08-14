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

            <div className="cc-container max-w-3xl mx-auto py-10">
                {message && (
                    <div className={`p-4 rounded-sm mb-6 text-xs font-bold border ${message.type === 'success' ? 'bg-neutral-50 text-black border-neutral-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                    <h1 className="text-2xl font-bold mb-6 text-neutral-900">Register New Account</h1>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Email Address <span className="text-red-600">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Password <span className="text-red-600">*</span></label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 pr-12 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                        placeholder="Minimum 6 characters"
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">First Name <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Middle Name <span className="text-neutral-400 font-normal">(Optional)</span></label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                    placeholder="Optional"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Last Name <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Passport Number <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="passportNumber"
                                required
                                value={formData.passportNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                            />
                        </div>

                        <DateSelector
                            name="dateOfBirth"
                            label="Date of Birth *"
                            required
                            value={formData.dateOfBirth}
                            onChange={(name, value) => setFormData({ ...formData, [name]: value })}
                        />

                        <div>
                            <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Gender <span className="text-red-600">*</span></label>
                            <select
                                name="gender"
                                required
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                            >
                                <option value="">Select your gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Phone Code <span className="text-red-600">*</span></label>
                                <select
                                    name="phoneCode"
                                    required
                                    value={formData.phoneCode}
                                    onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                >
                                    {phoneCodes.map((phone) => (
                                        <option key={phone.code} value={phone.code}>
                                            {phone.code} ({phone.country})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Phone Number <span className="text-red-600">*</span></label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                    placeholder="e.g. 1234567890"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Citizenship <span className="text-red-600">*</span></label>
                            <select
                                name="citizenship"
                                required
                                value={formData.citizenship}
                                onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                            >
                                <option value="">Select your country of citizenship</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country.charAt(0).toUpperCase() + country.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Country of Residence <span className="text-red-600">*</span></label>
                            <select
                                name="country"
                                required
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                            >
                                <option value="">Select your country</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country.charAt(0).toUpperCase() + country.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Address <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                placeholder="Street address"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">City <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">State/Province <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium font-black text-neutral-700 mb-1">Zip/Postal Code <span className="text-red-600">*</span></label>
                                <input
                                    type="text"
                                    name="zipcode"
                                    required
                                    value={formData.zipcode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-black"
                                />
                            </div>
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            label={isLoading ? 'Submitting...' : 'Create Account'}
                            isLoading={isLoading}
                            className="w-full"
                        />
                    </form>

                    <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
                        <p className="text-sm text-neutral-500">
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