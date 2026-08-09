'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export interface ComparisonResult {
  versionA: any;
  versionB: any;
  additions: any[];
  removals: any[];
  changes: any[];
  summary: {
    added: number;
    removed: number;
    modified: number;
    unchanged: number;
  };
}

export async function compareVersions(versionAId: string, versionBId: string): Promise<{ success: boolean; data?: ComparisonResult; error?: string }> {
  const adminClient = createServiceRoleClient();

  try {
    const [versionAResult, versionBResult] = await Promise.all([
      adminClient.from('timetable_versions').select('*').eq('id', versionAId).single(),
      adminClient.from('timetable_versions').select('*').eq('id', versionBId).single(),
    ]);

    if (versionAResult.error || !versionAResult.data) throw new Error('Version A not found');
    if (versionBResult.error || !versionBResult.data) throw new Error('Version B not found');

    const versionA = versionAResult.data;
    const versionB = versionBResult.data;

    const [assignmentsA, assignmentsB] = await Promise.all([
      adminClient.from('timetable_assignments').select('*').eq('version_id', versionAId),
      adminClient.from('timetable_assignments').select('*').eq('version_id', versionBId),
    ]);

    if (assignmentsA.error) throw assignmentsA.error;
    if (assignmentsB.error) throw assignmentsB.error;

    const aMap = new Map((assignmentsA.data || []).map((a: any) => [a.section_id, a]));
    const bMap = new Map((assignmentsB.data || []).map((a: any) => [a.section_id, a]));

    const additions: any[] = [];
    const removals: any[] = [];
    const changes: any[] = [];
    let unchanged = 0;

    const allKeys = new Set([...aMap.keys(), ...bMap.keys()]);

    for (const key of allKeys) {
      const a = aMap.get(key);
      const b = bMap.get(key);

      if (a && !b) {
        removals.push({ ...a, action: 'removed' });
      } else if (!a && b) {
        additions.push({ ...b, action: 'added' });
      } else if (a && b) {
        const changedFields: string[] = [];
        const compareFields = ['day_of_week', 'start_time', 'end_time', 'room_id', 'instructor_id'];

        for (const field of compareFields) {
          if (String(a[field] || '') !== String(b[field] || '')) {
            changedFields.push(field);
          }
        }

        if (changedFields.length > 0) {
          changes.push({
            section_id: key,
            before: a,
            after: b,
            changedFields,
          });
        } else {
          unchanged++;
        }
      }
    }

    const result: ComparisonResult = {
      versionA,
      versionB,
      additions,
      removals,
      changes,
      summary: {
        added: additions.length,
        removed: removals.length,
        modified: changes.length,
        unchanged,
      },
    };

    return { success: true, data: result };
  } catch (e: any) {
    console.error('compareVersions Error:', e);
    return { success: false, error: e.message };
  }
}
