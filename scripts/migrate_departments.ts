
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const schools = {
    arts: '75aa8b88-a35d-4e3e-8447-7b4df3031baf',
    business: 'a54123ea-caae-40ec-b3b0-d2c1d91528ca',
    science: 'b2f0e026-1089-4463-abaf-ce8122e3e5b8',
    tech: 'c710bc8b-2fae-43ce-bd5f-9cc289190754'
};

const departments = [
    // ARTS
    { name: 'Architecture', slug: 'architecture', schoolId: schools.arts, description: 'Combining artistic vision with technical competence in building and urban design.' },
    { name: 'Art and Media', slug: 'art-media', schoolId: schools.arts, description: 'Integrating contemporary art practices with digital media and visual communication.' },
    { name: 'Design', slug: 'design', schoolId: schools.arts, description: 'Explores design as a strategic, cultural, and human-centred practice.' },
    { name: 'Film, Television and Scenography', slug: 'film-tv', schoolId: schools.arts, description: 'Dedicated to cinematic arts, screen-based storytelling, and stage design.' },

    // BUSINESS
    { name: 'Accounting & Business Law', slug: 'accounting', schoolId: schools.business, description: 'Providing expertise in financial reporting, auditing, and corporate legal frameworks.' },
    { name: 'Economics', slug: 'economics', schoolId: schools.business, description: 'Analyzing markets, policies, and economic behavior for a sustainable future.' },
    { name: 'Finance', slug: 'finance', schoolId: schools.business, description: 'Advancing financial theory and practice in investment, corporate finance, and risk management.' },
    { name: 'Information and Service Management', slug: 'info-service', schoolId: schools.business, description: 'Focusing on the strategic use of data and technology in service-driven business.' },
    { name: 'Management Studies', slug: 'management', schoolId: schools.business, description: 'Developing leadership, strategy, and organizational capabilities in a global context.' },
    { name: 'Marketing', slug: 'marketing', schoolId: schools.business, description: 'Understanding consumer behavior and building sustainable brands in digital markets.' },

    // SCIENCE
    { name: 'Applied Physics', slug: 'applied-physics', schoolId: schools.science, description: 'Pushing the boundaries of physical science in quantum technology, materials, and energy.' },
    { name: 'Computer Science', slug: 'computer-science', schoolId: schools.science, description: 'Pioneering research in AI, cybersecurity, and software engineering.' },
    { name: 'Mathematics and Systems Analysis', slug: 'math-systems', schoolId: schools.science, description: 'Developing mathematical methods for complex systems and decision-making.' },
    { name: 'Industrial Engineering and Management', slug: 'industrial-engineering', schoolId: schools.science, description: 'Merging engineering with management for industrial innovation and efficiency.' },

    // TECHNOLOGY
    { name: 'Chemical and Metallurgical Engineering', slug: 'chemical-metallurgical', schoolId: schools.tech, description: 'Sustainable processing of materials and minerals for the circular economy.' },
    { name: 'Chemistry and Materials Science', slug: 'chemistry-materials', schoolId: schools.tech, description: 'Innovating in molecular science and high-performance materials.' },
    { name: 'Civil Engineering', slug: 'civil-engineering', schoolId: schools.tech, description: 'Engineering resilient infrastructure and sustainable urban environments.' },
    { name: 'Electrical Engineering and Automation', slug: 'electrical-automation', schoolId: schools.tech, description: 'Advancing smart grids, robotics, and intelligent control systems.' },
    { name: 'Electronics and Nanoengineering', slug: 'electronics-nano', schoolId: schools.tech, description: 'Developing the future of microelectronics, photonics, and space technology.' },
    { name: 'Information and Communications Engineering', slug: 'info-comms', schoolId: schools.tech, description: 'Shaping next-generation networks and communication systems.' },
    { name: 'Energy and Mechanical Engineering', slug: 'energy-mechanical', schoolId: schools.tech, description: 'Designing sustainable energy systems and advanced mechanical technologies.' }
];

async function migrate() {
    console.log('Starting department migration...');

    for (const dept of departments) {
        const { error } = await supabase
            .from('Department')
            .upsert(
                { ...dept, updatedAt: new Date().toISOString() },
                { onConflict: 'slug' }
            );

        if (error) {
            console.error(`Error migrating ${dept.name}:`, error.message);
        } else {
            console.log(`Successfully upserted ${dept.name}`);
        }
    }

    console.log('Migration complete.');
}

migrate();
