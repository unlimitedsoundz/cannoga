'use client';

import React, { useState, useEffect } from 'react';

interface DateSelectorProps {
    value?: string; // YYYY-MM-DD
    onChange?: (name: string, value: string) => void;
    name: string;
    required?: boolean;
    className?: string;
    label?: string;
}

export default function DateSelector({
    value = '',
    onChange,
    name,
    required = false,
    className = '',
    label
}: DateSelectorProps) {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-');
            setYear(y || '');
            setMonth(m || '');
            setDay(d || '');
        }
    }, [value]);

    const handleDateChange = (newYear: string, newMonth: string, newDay: string) => {
        if (newYear && newMonth && newDay) {
            const formattedDate = `${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`;
            if (onChange) {
                onChange(name, formattedDate);
            }
        } else {
            if (onChange) {
                onChange(name, '');
            }
        }
    };

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const getDaysInMonth = (m: string, y: string) => {
        if (!m || !y) return 31;
        return new Date(parseInt(y), parseInt(m), 0).getDate();
    };

    const days = Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 1);

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-[13px] font-semibold mb-1 text-black">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="flex gap-2 w-full max-w-[400px]">
                {/* Year */}
                <select
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                        handleDateChange(e.target.value, month, day);
                    }}
                    required={required}
                    className="flex-1 bg-white border border-neutral-200 rounded-lg px-2 h-[35px] text-[13px] text-black outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                >
                    <option value="">Year</option>
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                {/* Month */}
                <select
                    value={month}
                    onChange={(e) => {
                        setMonth(e.target.value);
                        handleDateChange(year, e.target.value, day);
                    }}
                    required={required}
                    className="flex-[1.5] bg-white border border-neutral-200 rounded-lg px-2 h-[35px] text-[13px] text-black outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                >
                    <option value="">Month</option>
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>

                {/* Day */}
                <select
                    value={day}
                    onChange={(e) => {
                        setDay(e.target.value);
                        handleDateChange(year, month, e.target.value);
                    }}
                    required={required}
                    className="flex-1 bg-white border border-neutral-200 rounded-lg px-2 h-[35px] text-[13px] text-black outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                >
                    <option value="">Day</option>
                    {days.map((d) => (
                        <option key={d} value={d.toString()}>{d}</option>
                    ))}
                </select>
            </div>
            {/* Hidden Input for Form Submission accessibility and reliability */}
            <input
                type="hidden"
                name={name}
                value={year && month && day ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : ''}
                required={required}
            />
        </div>
    );
}

