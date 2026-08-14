
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log('💰 Updating tuition fees...');

    // Update Bachelor's tuition
    const { error: bscError } = await supabase
        .from('Course')
        .update({ tuitionFee: '$8,000 / year' })
        .eq('degreeLevel', 'BACHELOR');

    if (bscError) console.error('Error updating BSc fees:', bscError);
    else console.log('✅ Updated Bachelor courses to $8,000/yr');

    // Update Master's tuition
    const { error: mscError } = await supabase
        .from('Course')
        .update({ tuitionFee: '$10,000 / year' })
        .eq('degreeLevel', 'MASTER');

    if (mscError) console.error('Error updating MSc fees:', mscError);
    else console.log('✅ Updated Master courses to $10,000/yr');
}

main();
