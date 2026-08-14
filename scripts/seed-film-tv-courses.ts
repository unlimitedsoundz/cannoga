
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedFilmTV() {
    console.log('Seeding Film & Television Courses...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'film-tv').single();
    if (!dept) {
        console.error('Department "film-tv" not found');
        return;
    }

    // --- Bachelor's Degree ---
    const bachelorSections = [
        {
            id: 'core',
            title: 'Film & Television Core',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Film Studies:</strong> Cinema history and analysis.</li>
                    <li><strong>History of Cinema & Television:</strong> Evolution of the medium.</li>
                    <li><strong>Narrative & Storytelling:</strong> Structure and plot.</li>
                    <li><strong>Screenwriting / Scriptwriting:</strong> Writing for the screen.</li>
                    <li><strong>Cinematography Basics:</strong> Camera, lighting, and composition.</li>
                    <li><strong>Directing for Film & TV:</strong> Visual storytelling and actor direction.</li>
                    <li><strong>Film & TV Production:</strong> Managing the shoot.</li>
                    <li><strong>Editing & Post-Production:</strong> Assembling the narrative.</li>
                </ul>
            `
        },
        {
            id: 'tv-media',
            title: 'Television Production & Media',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Television Studio Production:</strong> Multi-camera workflows.</li>
                    <li><strong>Broadcast Media & TV Programming:</strong> Content strategies.</li>
                    <li><strong>Camera & Lighting Techniques:</strong> Studio lighting.</li>
                    <li><strong>Sound Recording & Mixing:</strong> Audio for broadcast.</li>
                    <li><strong>Digital Media Production:</strong> New media formats.</li>
                </ul>
            `
        },
        {
            id: 'scenography',
            title: 'Scenography & Set Design',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Introduction to Scenography:</strong> Stage design fundamentals.</li>
                    <li><strong>Set Construction & Materials:</strong> Building the world.</li>
                    <li><strong>Costume & Prop Design:</strong> Character visualization.</li>
                    <li><strong>Lighting Design for Theatre & Film:</strong> Mood and atmosphere.</li>
                    <li><strong>Digital Set Design / 3D Modeling:</strong> Virtual environments.</li>
                    <li><strong>Scenic Visualization & Drafting:</strong> Technical drawing.</li>
                </ul>
            `
        },
        {
            id: 'technical',
            title: 'Technical & Digital Skills',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Video Editing Software:</strong> Adobe Premiere, Final Cut.</li>
                    <li><strong>Visual Effects & Compositing:</strong> After Effects, Nuke.</li>
                    <li><strong>Motion Graphics & Animation:</strong> Moving typography.</li>
                    <li><strong>Sound Design Software:</strong> Pro Tools, Logic.</li>
                </ul>
            `
        },
        {
            id: 'theory',
            title: 'Theory & Analysis',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Film & TV Theory:</strong> Critical frameworks.</li>
                    <li><strong>Media & Cultural Studies:</strong> Society and screen.</li>
                    <li><strong>Aesthetics of Stage & Screen:</strong> Visual style.</li>
                    <li><strong>Critical Analysis & Film Criticism:</strong> Reviewing and critique.</li>
                </ul>
            `
        },
        {
            id: 'professional',
            title: 'Professional & Practical Experience',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Workshop & Studio Practice:</strong> Hands-on training.</li>
                    <li><strong>Live Production Exercises:</strong> Real-time directing.</li>
                    <li><strong>Internship / Industry Placement:</strong> Professional immersion.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Final Film / TV Project:</strong> Short film or pilot.</li>
                    <li><strong>Scenography / Stage Design Project:</strong> Full scale design.</li>
                    <li><strong>Portfolio Development:</strong> Career preparation.</li>
                </ul>
            `
        }
    ];

    const bachelorData = {
        title: 'Bachelor of Arts in Film, Television and Scenography',
        slug: 'ba-film-tv',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A dynamic program combining filmmaking, television production, and scenography to train comprehensive visual storytellers.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: bachelorSections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-film-tv.jpg',
        careerPaths: 'Filmmaker, Set Designer, TV Producer, Cinematographer, Editor'
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-practice',
            title: 'Advanced Film & TV Practice',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Directing & Producing:</strong> Feature & series development.</li>
                    <li><strong>Advanced Cinematography:</strong> Visual style and lighting.</li>
                    <li><strong>Advanced Editing & Post-Production:</strong> Color grading and sound.</li>
                    <li><strong>Documentary Filmmaking:</strong> Factual storytelling.</li>
                    <li><strong>Experimental Film & Media:</strong> Avant-garde techniques.</li>
                </ul>
            `
        },
        {
            id: 'adv-sceno',
            title: 'Advanced Scenography',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Stage Design:</strong> Complex productions.</li>
                    <li><strong>Production Design for Film & TV:</strong> World building.</li>
                    <li><strong>Digital & Virtual Set Design:</strong> Virtual production.</li>
                    <li><strong>Lighting & Projection Design:</strong> Visual spectacle.</li>
                    <li><strong>Interactive & Immersive Scenography:</strong> VR/AR environments.</li>
                </ul>
            `
        },
        {
            id: 'specialization',
            title: 'Specialization Tracks (Electives)',
            content: `
                <h4 class="font-bold mt-4 mb-2">Film & TV Production</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Advanced Sound Design</li>
                    <li>Screenwriting Masterclass</li>
                    <li>Production Management</li>
                    <li>Visual Storytelling</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Scenography & Design</h4>
                <ul class="list-disc pl-5 space-y-2 mb-4">
                    <li>Architectural Scenography</li>
                    <li>Costume & Props for Performance</li>
                    <li>Digital Visualization & VR Sets</li>
                    <li>Installation & Exhibition Design</li>
                </ul>

                <h4 class="font-bold mt-4 mb-2">Theory & Criticism</h4>
                <ul class="list-disc pl-5 space-y-2">
                    <li>Contemporary Media Theory</li>
                    <li>Film, Television & Stage Criticism</li>
                    <li>Media Aesthetics & Semiotics</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Film & Media:</strong> Scholarly inquiry.</li>
                    <li><strong>Graduate Seminar:</strong> Critical discussion.</li>
                    <li><strong>Industry Collaboration:</strong> Real-world projects.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Film Project / Scenography Project:</strong> Major creative work.</li>
                    <li><strong>Public Screening / Exhibition:</strong> Showcase event.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Arts in Film, Television and Scenography',
        slug: 'ma-film-tv',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced degree for artists specializing in cinematic storytelling, production design, and immersive media environments.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-film-tv.jpg',
        careerPaths: 'Film Director, Production Designer, Creative Director, Media Artist'
    };

    // Upsert Bachelor
    const { error: bErr } = await supabase.from('Course').upsert(bachelorData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BA Film-TV:', bErr);
    else console.log('✅ Successfully seeded "BA Film, Television and Scenography".');

    // Upsert Master
    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MA Film-TV:', mErr);
    else console.log('✅ Successfully seeded "MA Film, Television and Scenography".');
}

seedFilmTV();
