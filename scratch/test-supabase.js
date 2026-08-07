
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
    const { data: news, error: newsError } = await supabase.from('News').select('slug')
    console.log('News:', news, newsError)
    
    const { data: schools, error: schoolsError } = await supabase.from('School').select('slug')
    console.log('Schools:', schools, schoolsError)
    
    const { data: courses, error: coursesError } = await supabase.from('Course').select('slug')
    console.log('Courses:', courses, coursesError)
}

test()
