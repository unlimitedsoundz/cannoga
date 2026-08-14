'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Course } from '@/types/database';

export default function ProgramSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('Course').select('id, title, slug, degreeLevel, duration');
      setAllCourses((data || []) as any[]);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (query.trim().length === 0 || loading) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = allCourses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setIsOpen(true);
  }, [query, allCourses, loading]);

  const handleSelect = (slug: string) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/studies/${slug}`);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full lg:w-auto">
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Programs"
            className="w-64 lg:w-80 px-4 py-2.5 text-sm font-bold text-black placeholder:text-black/50 border border-neutral-300 focus:outline-none focus:border-[#0f2027] transition-colors"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          className="w-10 h-10 bg-[#0f2027] hover:bg-[#1a3644] text-white flex items-center justify-center transition-colors rounded-sm"
          aria-label="Search"
        >
          <Search size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-80 lg:w-96 bg-white border border-neutral-200 shadow-lg z-50 max-h-80 overflow-y-auto animate-drawer-slide">
          {results.map((course) => (
            <button
              key={course.id}
              onClick={() => handleSelect(course.slug)}
              className="w-full text-left px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 transition-colors"
            >
              <p className="text-sm font-bold text-black">{course.title}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{course.degreeLevel} • {course.duration}</p>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full mt-2 w-80 lg:w-96 bg-white border border-neutral-200 shadow-lg z-50 p-4 animate-drawer-slide">
          <p className="text-sm text-neutral-500">No programs found matching &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
