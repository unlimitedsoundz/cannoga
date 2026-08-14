require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: 'public' } }
);

(async () => {
  const { data: pageData, error: pageError } = await supabase
    .from('faq_pages')
    .select('id, slug')
    .eq('slug', 'admissions/tuition')
    .single();

  if (pageError) throw pageError;

  const { data: faqData, error: faqError } = await supabase
    .from('faq')
    .select('id, question, answer, order_index, is_published')
    .eq('page_id', pageData.id)
    .order('order_index');

  if (faqError) throw faqError;

  const normalized = (faqData || []).map(f => ({
    id: f.id,
    question: (f.question || '').trim().toLowerCase(),
    answer: (f.answer || '').trim().toLowerCase(),
    questionText: f.question,
    answerText: f.answer,
    order_index: f.order_index,
    is_published: f.is_published,
  }));

  const seen = new Map();
  const duplicates = [];
  for (const item of normalized) {
    const key = `${item.question}::${item.answer}`;
    if (seen.has(key)) {
      duplicates.push({
        id: item.id,
        question: item.questionText,
        answer: item.answerText,
        duplicateOf: seen.get(key),
      });
    } else {
      seen.set(key, item.id);
    }
  }

  console.log(JSON.stringify({ pageId: pageData.id, total: faqData?.length || 0, duplicates }, null, 2));
})();
