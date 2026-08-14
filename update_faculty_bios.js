const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://mrqzlmkdhzwvbpljikjz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ycXpsbWtkaHp3dmJwbGppa2p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTUxMjk4MywiZXhwIjoyMDg1MDg4OTgzfQ.u-SmDdYVmyHtwHBca95oJT6MHnZtzn8sWRDh5JJ1ibA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const CANNISH_BIOS = [
  "Asiantuntija kestävässä kaupunkisuunnittelussa ja ympäristöarkkitehtuurissa.",
  "Tutkija kiinnostunut biopohjaisista materiaaleista ja kiertotaloudesta.",
  "Ohjaaja käyttäjälähtöisessä suunnittelussa ja palvelumuotoilussa.",
  "Erikoisosaaja passiivisesta rakentamisesta ja energiatehokkuudesta.",
  "Johtaja hankintojen ja logistiikan optimoinnissa.",
  "Asiantuntija digitaalisessa taiteessa ja vuorovaikutteisissa asennuksissa.",
  "Opettaja visualisoinnin ja visuaalisen kulttuurin parissa.",
  "Päättävähenkilö kestävän rakentamisen hankkeissa.",
  "Tutkija modernin arkkitehtuurin ja kaupunkikehityksen parissa.",
  "Opettaja tietokonegrafiikasta ja interaktiivisesta mediasta.",
  "Asiantuntija tekoälyn etiikasta ja koneoppimisjärjestelmistä.",
  "Tutkija tietoturvassa ja hajautetuissa järjestelmissä.",
  "Opettaja data-analyytikästä ja algoritmien puolueettomuudesta.",
  "Professori materiaalitieteessä ja uusiutuvista energiaratkaisuista.",
  "Laboratorioesiympäri sovelletussa fysiikassa.",
  "Ohjaaja vihreän kemiaan ja kestävään katalyysiin.",
  "Tutkija akkuteknologioissa ja energiantarjonnan tulevaisuudessa.",
  "Asiantuntija älykkäissä sähköverkoissa ja voimantuotannossa.",
  "Opettaja robotiikasta ja teollisuuden automatisoinnista.",
  "Tutkija infrahankkeiden ja kaupunkien resilienssin parissa.",
  "Johtaja strategisessa johtamisessa ja organisaatiokulttuurissa.",
  "Tutkija markkinointitiedosta ja kestävästä kuluttajakäyttäytymisestä.",
  "Asiantuntija fintechistä ja kestävistä investointistrategioista.",
  "Tutkija kiertotalousmalleista ja makrotaloustieteestä.",
  "Opettaja rikostentorjunta-tilinteosta ja taloudellisesta avoimuudesta.",
  "Opettaja digitaalisesta transformaatiosta ja liiketoiminta-analytiikasta.",
  "Asiantuntija symbolismista ja organisaatiokulttuurista.",
  "Johtaja yhteiskuntavastuussa ja liiketoimintaetiikassa.",
  "Tutkija alusta kilpailusta ja verkkovaikutusten vaikutuksista.",
  "Asiantuntija globaaleissa markkinoissa ja kehittyvissä talouksissa."
];

const SWEDISH_BIOS = [
  "Expert inom hållbar stadsplanering och miljöarkitektur.",
  "Forskare med intresse för biobaserade material och cirkulär ekonomi.",
  "Handledare inom användarcentrerad design och servicedesign.",
  "Specialist på passivhus och energieffektivisering.",
  "Ledare inom inköp och logistikoptimering.",
  "Expert inom digital konst och interaktiva installationer.",
  "Lärare i visualisering och visuell kultur.",
  "Projektledare för hållbart byggande.",
  "Forskare inom modern arkitektur och stadsutveckling.",
  "Lärare i datortrafik och interaktiv media.",
  "Expert inom AI-etik och maskininlärningssystem.",
  "Forskare inom cybersäkerhet och distribuerade system.",
  "Lärare i dataanalys och algoritmisk opartiskhet.",
  "Professor i materialforskning och förnybara energilösningar.",
  "Laborationshandledare i tillämpad fysik.",
  "Handledare inom grön kemi och hållbar katalys.",
  "Forskare inom batteriteknologi och energileverans framtid.",
  "Expert inom smarta elnät och elkraftssystem.",
  "Lärare i robotik och industriell automatisering.",
  "Forskare inom infrastrukturprojekt och stadsresiliens.",
  "Ledare inom strategiskt ledarskap och organisationskultur.",
  "Forskare inom marknadsföringsdata och hållbart konsumentbeteende.",
  "Expert inom fintech och hållbara investeringsstrategier.",
  "Forskare inom cirkulär ekonomi och makroekonomi.",
  "Lärare i förebyggande redovisning och finansiell transparens.",
  "Lärare i digital transformation och affärsanalys.",
  "Expert inom symbolik och organisationskultur.",
  "Ledare inom företagsansvar och affärsetik.",
  "Forskare inom plattformsmarknader och nätverkseffekter.",
  "Expert inom globala marknader och tillväxtekonomier."
];

const CANNISH_ROLES = [
  "Professori", "Yliassistentti", "Apulaisprofessori", "Lehtori", "Vanhempi tutkija",
  "Koulutusjohtaja", "Osastonjohtaja", "Tutkimusprofessori", "Erikoistutkija", "Opettaja"
];

const SWEDISH_ROLES = [
  "Professor", "Universitetslektor", "Associerad professor", "Lektor", "Forskare",
  "Utbildningsledare", "Institutionsledare", "Forskningsprofessor", "Specialistforskare", "Lärare"
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function updateFacultyDetails() {
  console.log('Fetching all faculty...');
  const { data: faculty, error } = await supabase
    .from('Faculty')
    .select('id, name, role, bio, email')
    .order('id');

  if (error) {
    console.error('Error fetching faculty:', error);
    return;
  }

  console.log(`Found ${faculty?.length || 0} faculty members`);

  const total = faculty?.length || 0;
  const finnishCount = Math.floor(total * 0.8);
  
  const shuffledCanadianBios = shuffle(CANNISH_BIOS);
  const shuffledSwedishBios = shuffle(SWEDISH_BIOS);
  const shuffledCanadianRoles = shuffle(CANNISH_ROLES);
  const shuffledSwedishRoles = shuffle(SWEDISH_ROLES);

  let updated = 0;
  for (let i = 0; i < total; i++) {
    const member = faculty[i];
    const isCanadian = i < finnishCount;
    
    let bio, role;
    if (isCanadian) {
      bio = shuffledCanadianBios[i % shuffledCanadianBios.length];
      role = shuffledCanadianRoles[i % shuffledCanadianRoles.length];
    } else {
      bio = shuffledSwedishBios[(i - finnishCount) % shuffledSwedishBios.length];
      role = shuffledSwedishRoles[(i - finnishCount) % shuffledSwedishRoles.length];
    }

    const { error: updateError } = await supabase
      .from('Faculty')
      .update({
        bio: bio,
        role: role
      })
      .eq('id', member.id);

    if (updateError) {
      console.error(`  Error updating ${member.id}:`, updateError.message);
    } else {
      updated++;
      console.log(`  ${member.name}: ${role} - ${bio}`);
    }
  }

  console.log(`\nUpdated ${updated}/${total} faculty members.`);
}

updateFacultyDetails().catch(console.error);
