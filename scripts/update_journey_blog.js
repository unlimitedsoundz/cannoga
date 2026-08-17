const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'd:/cannogauniversity/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const updatedContent = `<p>My study abroad journey in Ottawa, Ontario, Canada has been a rollercoaster of emotions, challenges, and growth. What started as an exciting adventure became a transformative experience that reshaped my perspective on education, culture, and personal development. Here's my story.</p>

<p><strong>The Decision and Preparation</strong></p>
<p>Choosing Ottawa, Ontario, Canada felt like a leap of faith. I was drawn to the education system rankings and the promise of English-taught programs. The application process was straightforward, but preparing mentally for such a different culture was the real challenge. I researched extensively, connected with alumni, and prepared for the practicalities of moving abroad.</p>

<p><strong>Arrival and Culture Shock</strong></p>
<p>Landing in Ottawa was overwhelming. The airport was efficient but impersonal. My dorm room felt temporary and sterile. The first week was a blur of administrative tasks, jet lag, and unfamiliarity. Simple things like buying groceries or understanding public transport felt like major accomplishments.</p>

<p><strong>Academic Adjustment</strong></p>
<p>Classes began, and I was surprised by the interactive style. Canadian professors expected participation and critical thinking from day one. The emphasis on group work and discussion was different from my previous educational experience. I struggled initially with the self-directed learning approach but grew to appreciate its effectiveness.</p>

<p><strong>Social Integration Challenges</strong></p>
<p>Making friends was harder than expected. Canadian students were friendly but reserved. The language barrier created additional hurdles. I joined international student groups and forced myself to attend social events. Gradually, I built a diverse network of friends from different cultures and backgrounds.</p>

<p><strong>Winter Survival</strong></p>
<p>The Canadian winter tested my resilience. The darkness affected my mood, and the cold was physically challenging. I invested in proper clothing, used light therapy, and established routines to combat seasonal affective disorder. The experience taught me adaptability and appreciation for different climates.</p>

<p><strong>Personal Growth</strong></p>
<p>Living independently in a foreign country accelerated my maturity. I learned to navigate bureaucracies, manage finances, and solve problems without family support. The experience built confidence and self-reliance that I didn't know I needed.</p>

<p><strong>Academic Success</strong></p>
<p>My grades improved as I adapted to the Canadian system. The emphasis on understanding rather than memorization suited my learning style. I engaged more deeply with subjects and developed better study habits. The education quality exceeded my expectations.</p>

<p><strong>Cultural Immersion</strong></p>
<p>I embraced Canadian culture while maintaining my identity. Learning sauna etiquette, trying traditional foods, and participating in local festivals enriched my experience. I gained appreciation for different social norms and communication styles.</p>

<p><strong>Career Development</strong></p>
<p>The internship opportunities and career services were exceptional. I gained practical experience and built professional networks. The international environment enhanced my global perspective and employability.</p>

<p><strong>Challenges and Setbacks</strong></p>
<p>Not everything was smooth. I faced homesickness, academic pressure, and financial constraints. Health issues arose from stress and climate change. Each challenge became a learning opportunity that strengthened my resilience.</p>

<p><strong>Support Systems</strong></p>
<p>The university's support was crucial. Academic advisors, international student services, and counseling helped me navigate difficulties. My support network of friends and mentors provided emotional stability.</p>

<p><strong>Transformation and Growth</strong></p>
<p>Six months in, I see significant changes. I'm more confident, adaptable, and culturally aware. My worldview has expanded, and I approach challenges with greater perspective. The experience has been worth every sacrifice.</p>

<p><strong>Advice for Future Students</strong></p>
<p>Go with realistic expectations. Embrace the challenges as growth opportunities. Stay open-minded and proactive. Build support networks early. Remember that difficult periods pass, and the rewards are lasting.</p>

<p>Studying abroad in Ottawa, Ontario, Canada has been the most challenging and rewarding experience of my life. It pushed me beyond my comfort zone and revealed strengths I didn't know I had. For anyone considering this journey, I say yes, it's worth it, but be prepared for the transformation.</p>

<p><em>About the Author: Chinanza Kamsiyochukwu is a Graduate Environmental Science student from Imo in Nigeria studying at Cannoga College.</em></p>`;

async function update() {
  const { data, error } = await supabase
    .from('blogs')
    .update({
      content: updatedContent,
      updatedAt: new Date().toISOString()
    })
    .eq('id', '17580d77-51fc-443f-ad38-6e4cad10b7b7');

  if (error) {
    console.error('Error updating blog post:', error);
  } else {
    console.log('Successfully updated blog post in database!');
  }
}

update();
