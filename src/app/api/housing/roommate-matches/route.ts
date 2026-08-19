import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import type { RoommateProfile } from '@/types/housing';

export const dynamic = 'force-dynamic';

// Weighted compatibility scoring
function computeCompatibility(a: RoommateProfile, b: RoommateProfile): number {
    let score = 0;
    let maxScore = 0;

    // Sleep schedule (weight: 25)
    maxScore += 25;
    if (a.sleep_schedule === b.sleep_schedule) score += 25;
    else if (Math.abs(['early','moderate','night'].indexOf(a.sleep_schedule) - ['early','moderate','night'].indexOf(b.sleep_schedule)) === 1) score += 12;

    // Study habits (weight: 20)
    maxScore += 20;
    if (a.study_habits === b.study_habits) score += 20;
    else if (a.study_habits !== 'social' && b.study_habits !== 'social') score += 10;

    // Cleanliness (weight: 20)
    maxScore += 20;
    const cleanDiff = Math.abs(a.cleanliness_rating - b.cleanliness_rating);
    if (cleanDiff === 0) score += 20;
    else if (cleanDiff === 1) score += 14;
    else if (cleanDiff === 2) score += 7;

    // Guest preference (weight: 15)
    maxScore += 15;
    if (a.guest_preference === b.guest_preference) score += 15;
    else if (a.guest_preference !== 'frequent' && b.guest_preference !== 'frequent') score += 8;

    // Floor type preference (weight: 10)
    maxScore += 10;
    if (a.floor_type_preference === 'any' || b.floor_type_preference === 'any') score += 10;
    else if (a.floor_type_preference === b.floor_type_preference) score += 10;

    // Gender preference alignment (weight: 10)
    maxScore += 10;
    if (a.gender_preference === 'any' || b.gender_preference === 'any') score += 10;
    else if (a.gender_preference === b.gender_preference) score += 10;

    return Math.round((score / maxScore) * 100);
}

export async function GET(_req: NextRequest) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current student's profile
    const { data: myProfile } = await supabase
        .from('housing_roommate_profiles')
        .select('*')
        .eq('student_id', user.id)
        .maybeSingle();

    if (!myProfile) {
        return NextResponse.json({ matches: [], message: 'Complete your lifestyle profile first to see matches.' });
    }

    // Get all other profiles (exclude self)
    const { data: otherProfiles, error } = await supabase
        .from('housing_roommate_profiles')
        .select('*')
        .neq('student_id', user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Score each candidate
    const matches = (otherProfiles ?? [])
        .map((profile: Record<string, unknown>) => ({
            ...profile,
            compatibility_score: computeCompatibility(myProfile as RoommateProfile, profile as unknown as RoommateProfile),
        }))
        .filter((m: Record<string, unknown>) => (m.compatibility_score as number) >= 40)
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (b.compatibility_score as number) - (a.compatibility_score as number))
        .slice(0, 20);

    return NextResponse.json({ matches, my_profile: myProfile });
}
