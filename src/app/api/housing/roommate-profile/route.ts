import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import type { RoommateProfile } from '@/types/housing';

export const dynamic = 'force-dynamic';

// GET /api/housing/roommate-profile
export async function GET(_req: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
        .from('housing_roommate_profiles')
        .select('*')
        .eq('student_id', user.id)
        .maybeSingle();

    if (error) {
        console.error('[GET /api/housing/roommate-profile]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: profile ?? null });
}

// POST /api/housing/roommate-profile
export async function POST(req: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
        sleep_schedule,
        study_habits,
        cleanliness_rating,
        guest_preference,
        gender_preference,
        floor_type_preference,
        dietary_needs,
        requested_friend_student_ids,
        hobbies,
        bio,
    } = body;

    // Validate required fields
    if (!sleep_schedule || !study_habits || !cleanliness_rating || !guest_preference) {
        return NextResponse.json({ error: 'Missing required preference fields' }, { status: 400 });
    }

    if (typeof cleanliness_rating !== 'number' || cleanliness_rating < 1 || cleanliness_rating > 5) {
        return NextResponse.json({ error: 'cleanliness_rating must be between 1 and 5' }, { status: 400 });
    }

    // Cap friend requests at 3
    const friendIds = Array.isArray(requested_friend_student_ids)
        ? requested_friend_student_ids.slice(0, 3)
        : [];

    const payload: Partial<RoommateProfile> & { student_id: string; updated_at: string } = {
        student_id: user.id,
        sleep_schedule,
        study_habits,
        cleanliness_rating: cleanliness_rating as 1 | 2 | 3 | 4 | 5,
        guest_preference,
        gender_preference:           gender_preference           ?? 'any',
        floor_type_preference:       floor_type_preference       ?? 'any',
        dietary_needs:               Array.isArray(dietary_needs) ? dietary_needs : [],
        requested_friend_student_ids: friendIds,
        hobbies:                     hobbies   ?? null,
        bio:                         bio       ?? null,
        updated_at:                  new Date().toISOString(),
    };

    const { data: profile, error } = await supabase
        .from('housing_roommate_profiles')
        .upsert(payload, { onConflict: 'student_id' })
        .select()
        .single();

    if (error) {
        console.error('[POST /api/housing/roommate-profile]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile, success: true });
}
