
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

const departmentData = [
    // ARTS
    {
        slug: 'architecture',
        imageUrl: '/images/departments/placeholder-architecture.jpg',
        description: 'The Department of Architecture combines artistic creativity with technical proficiency. Our curriculum emphasizes sustainable design, urban planning, and the preservation of architectural heritage. Students engage in rigorous studio work, learning to shape the built environment in ways that enhance human experience and ecological balance. We foster a culture of critical inquiry, encouraging students to challenge conventional design paradigms and explore innovative solutions for modern living.'
    },
    {
        slug: 'art-media',
        imageUrl: '/images/departments/placeholder-art-media.jpg',
        description: 'The Department of Art and Media is a vibrant hub for interdisciplinary creative practice. We explore the convergence of visual arts, photography, digital media, and cultural studies. Our programs are designed to nurture artistic expression while providing a solid theoretical foundation. Students are encouraged to experiment with new media formats, engage in critical discourse, and develop a unique artistic voice that resonates in a rapidly evolving digital landscape.'
    },
    {
        slug: 'design',
        imageUrl: '/images/departments/placeholder-design.jpg',
        description: 'At the Department of Design, we believe in the power of design to solve complex problems and improve quality of life. Our comprehensive programs cover industrial design, fashion, textile design, and service design. We merge traditional craftsmanship with cutting-edge technology, preparing students to become visionary leaders in the creative industries. Collaborative projects with industry partners provide real-world experience, ensuring our graduates are ready to drive innovation.'
    },
    {
        slug: 'film-tv',
        imageUrl: '/images/departments/placeholder-film-tv.jpg',
        description: 'The Department of Film, Television and Scenography provides world-class education in the cinematic arts. From screenwriting and directing to production design and cinematography, our courses cover every aspect of visual storytelling. We offer state-of-the-art facilities and a collaborative environment where students work in teams to produce professional-quality films. Our alumni are recognized globally for their contributions to the art of cinema and television.'
    },
    // BUSINESS
    {
        slug: 'accounting-business-law',
        imageUrl: '/images/departments/placeholder-accounting.jpg',
        description: 'The Department of Accounting & Business Law offers a rigorous foundation in financial reporting, auditing, and corporate governance. We emphasize ethics, transparency, and the critical role of accounting in the global economy. Our business law curriculum equips students with the legal knowledge necessary to navigate complex regulatory environments. Graduates leave with strong analytical skills, prepared for leadership roles in financial institutions and multinational corporations.'
    },
    {
        slug: 'economics',
        imageUrl: '/images/departments/placeholder-economics.jpg',
        description: 'Our Department of Economics is dedicated to understanding the mechanisms that drive prosperity and well-being. We offer deep training in micro- and macroeconomics, econometrics, and policy analysis. Students tackle pressing global challenges such as inequality, climate change, and market stability. Through research-led teaching, we empower the next generation of economists to formulate data-driven policies that promote sustainable economic growth.'
    },
    {
        slug: 'finance',
        imageUrl: '/images/departments/placeholder-finance.jpg',
        description: 'The Department of Finance provides advanced education in asset pricing, corporate finance, and risk management. We combine theoretical rigor with practical application, utilizing modern financial tools and market data. Our program prepares students for high-level careers in investment banking, asset management, and financial consultancy. We focus on responsible finance, encouraging students to consider the long-term impact of financial decisions on society.'
    },
    {
        slug: 'info-service',
        imageUrl: '/images/departments/placeholder-info-service.jpg',
        description: 'In the Department of Information and Service Management, we bridge the gap between business strategy and technology. Our focus areas include business analytics, supply chain management, and information systems. We teach students how to leverage data to optimize business processes and create value-added services. Graduates are equipped to lead digital transformation initiatives in a wide range of industries.'
    },
    {
        slug: 'management',
        imageUrl: '/images/departments/placeholder-management.jpg',
        description: 'The Department of Management Studies explores the human side of business. We focus on organizational behavior, leadership, strategy, and international business. Our goal is to develop responsible leaders who can inspire teams, manage change, and navigate the complexities of a globalized business environment. Through case studies and interactive learning, students gain the interpersonal and strategic skills essential for modern management.'
    },
    {
        slug: 'marketing',
        imageUrl: '/images/departments/placeholder-marketing.jpg',
        description: 'The Department of Marketing is at the forefront of consumer research and brand strategy. We explore customer behavior, digital marketing, and market analytics. Our curriculum encourages creativity and data-driven decision-making. Students learn to build strong brands, design customer-centric experiences, and develop marketing strategies that drive growth and engagement in competitive markets.'
    },
    // TECHNOLOGY
    {
        slug: 'applied-physics',
        imageUrl: '/images/departments/placeholder-physics.jpg',
        description: 'The Department of Applied Physics conducts cutting-edge research in quantum technology, nanomaterials, and energy systems. Our education emphasizes a deep understanding of physical laws combined with practical engineering applications. Students work in world-class laboratories, contributing to breakthroughs that shape the future of technology. We prepare graduates for research careers and roles in high-tech industries requiring advanced problem-solving skills.'
    },
    {
        slug: 'chemical-metallurgical',
        imageUrl: '/images/departments/placeholder-chemical.jpg',
        description: 'Our Department of Chemical and Metallurgical Engineering focuses on sustainable processing of materials and circular economy solutions. We cover areas from mineral processing to advanced materials synthesis. Students learn to design efficient, environmentally friendly industrial processes. Our research drives innovation in battery technology, recycling, and sustainable metallurgy, crucial for a resource-efficient future.'
    },
    {
        slug: 'chemistry-materials',
        imageUrl: '/images/departments/placeholder-chemistry.jpg',
        description: 'The Department of Chemistry and Materials Science explores the molecular building blocks of our world. We specialize in functional materials, organic synthesis, and soft matter. Our interdisciplinary approach combines chemistry, physics, and biology to develop new materials with novel properties. Graduates are experts in material characterization and synthesis, ready to address challenges in health, energy, and the environment.'
    },
    {
        slug: 'civil-engineering',
        imageUrl: '/images/departments/placeholder-civil.jpg',
        description: 'The Department of Civil Engineering shapes the infrastructure of tomorrow. Our focus spans structural engineering, geotechnics, and transportation systems. We emphasize resilience, sustainability, and the digitalization of the construction industry. Students gain hands-on experience in designing safe, efficient, and sustainable urban environments, preparing them to lead major infrastructure projects globally.'
    },
    {
        slug: 'computer-science',
        imageUrl: '/images/departments/placeholder-cs.jpg',
        description: 'The Department of Computer Science is a powerhouse of innovation in AI, algorithms, and software systems. We offer a comprehensive curriculum covering machine learning, data science, and theoretical computer science. Our students engage in cutting-edge research and practical software development. We aim to educate versatile computer scientists who can develop secure, scalable, and intelligent technologies that transform society.'
    },
    {
        slug: 'electrical-automation',
        imageUrl: '/images/departments/placeholder-electrical.jpg',
        description: 'The Department of Electrical Engineering and Automation drives the electrification of society. We focus on power systems, renewable energy integration, and robotics. Our students learn to design and control complex electrical systems, from smart grids to autonomous machines. We are committed to developing energy-efficient solutions that support the transition to a sustainable, carbon-neutral future.'
    },
    {
        slug: 'electronics-nano',
        imageUrl: '/images/departments/placeholder-electronics.jpg',
        description: 'At the Department of Electronics and Nanoengineering, we work at the extremes of scale to enable next-generation devices. Our research covers microelectronics, photonics, and space technology. Students learn to design and fabricate nanoscale devices that power modern communications and sensing systems. We foster innovation in hardware technology, preparing graduates for the fast-paced semiconductor and electronics industries.'
    },
    {
        slug: 'industrial-engineering',
        imageUrl: '/images/departments/placeholder-industrial.jpg',
        description: 'The Department of Industrial Engineering and Management combines engineering knowledge with business acumen. We focus on operations management, entrepreneurship, and strategy. Students learn to optimize complex systems, launch new ventures, and manage technology-driven organizations. Our graduates are highly sought after for their ability to bridge the gap between technical teams and business leadership.'
    },
    {
        slug: 'info-comms',
        imageUrl: '/images/departments/placeholder-info-comms.jpg',
        description: 'The Department of Information and Communications Engineering is dedicated to the future of connectivity. We explore wireless communications, signal processing, and human-computer interaction. Our research paves the way for 6G networks and immersive digital experiences. Students gain expertise in the underlying technologies of the internet and mobile networks, preparing them to build the communication infrastructures of the future.'
    },
    {
        slug: 'math-systems',
        imageUrl: '/images/departments/placeholder-math.jpg',
        description: 'The Department of Mathematics and Systems Analysis provides the mathematical foundation for science and technology. We specialize in applied mathematics, operations research, and system theory. Our curriculum trains students in rigorous logical thinking and advanced modeling techniques. Graduates are equipped to solve complex problems in finance, engineering, and data science using powerful mathematical tools.'
    },
    {
        slug: 'energy-mechanical',
        imageUrl: '/images/departments/placeholder-mechanical.jpg',
        description: 'The Department of Energy and Mechanical Engineering focuses on sustainable energy conversion and machine design. We cover thermodynamics, fluid mechanics, and marine technology. Our goal is to develop efficient engines, renewable energy systems, and robust mechanical structures. Students participate in hands-on projects, learning to design and analyze systems that are crucial for energy security and industrial progress.'
    }
];

async function updateDepartments() {
    console.log('Starting comprehensive department update...');

    for (const data of departmentData) {
        console.log(`Updating ${data.slug}...`);

        const { error } = await supabase
            .from('Department')
            .update({
                description: data.description,
                imageUrl: data.imageUrl
            })
            .eq('slug', data.slug);

        if (error) {
            console.error(`❌ Error updating ${data.slug}:`, error.message);
        } else {
            console.log(`✅ Updated ${data.slug}`);
        }
    }

    console.log('Department update complete.');
}

updateDepartments();
