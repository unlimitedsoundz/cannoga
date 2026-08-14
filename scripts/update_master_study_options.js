import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newContent = `<div class="space-y-6 text-black">
    <p class="text-lg leading-relaxed">Cannoga College provides master's education across diverse fields of study, including Art and Design, Business and Economics, Technology and Engineering, Education, Science, Health and Life Sciences, and Transportation and Aviation.</p>

    <div>
        <h3 class="text-xl font-bold mb-4">Master’s Degrees Granted</h3>
        <ul class="space-y-3 text-base">
            <li><strong>In the field of Art and Design:</strong> Master of Arts (Art and Design)</li>
            <li><strong>In the field of Business and Economics:</strong> Master of Science (Economics and Business Administration)</li>
            <li><strong>In the field of Technology and Engineering:</strong> Master of Science (Technology), Master of Science (Architecture), or Master of Science (Landscape Architecture)</li>
            <li><strong>In the field of Education and Science:</strong> Master of Arts (Education), Master of Science (Educational Leadership), or Master of Science (Natural & Applied Sciences)</li>
            <li><strong>In the field of Health and Life Sciences:</strong> Master of Science (Healthcare Management & Public Health)</li>
            <li><strong>In the field of Transportation and Aviation:</strong> Master of Science (Aviation Management & Transport Logistics)</li>
        </ul>
        <p class="mt-4 font-semibold text-sm text-gray-700">You may apply to a maximum of two study options.</p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Art & Design</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MA in Design, Architecture, Visual Arts, and Media Practices.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Business & Economics</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Accounting & Finance, Strategic Management, and Economics.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Technology & Engineering</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Engineering, Computer Science, Data Analytics, and Architecture.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Education</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MA/MSc in Pedagogy, Educational Leadership, and Curriculum Design.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Science</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Environmental Science, Applied Physics, and Bio-Analytics.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Health & Life Sciences</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Healthcare Leadership, Clinical Management, and Public Health.</p>
        </div>
        <div class="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-xs">
            <h4 class="font-bold text-lg mb-2">Transportation & Aviation</h4>
            <p class="text-sm text-gray-700 leading-relaxed">MSc in Aviation Operations, Supply Chain Logistics, and Transport Safety.</p>
        </div>
    </div>

    <p class="text-sm text-gray-600 pt-2">You can find all Cannoga College study options on the <a href="/studies" class="underline font-bold text-black hover:text-neutral-700">Degree programmes page</a>. You can filter your search results by field of education, level of degree, and language of instruction. On each study option's page, you will find detailed information on the studies, language of instruction, and admissions criteria.</p>
</div>`;

async function updateDb() {
    const { data, error } = await supabase
        .from('page_content')
        .update({
            content: newContent,
            updated_at: new Date().toISOString()
        })
        .eq('page_slug', 'admissions/master')
        .eq('section_key', 'study_options_content')
        .select();

    console.log('DB Update result:', { count: data?.length, error });
}

updateDb();