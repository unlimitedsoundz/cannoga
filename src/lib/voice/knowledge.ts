'use server';

import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import type { KnowledgeEntry, FAQEntry, CreateKnowledgePayload, UpdateKnowledgePayload, CreateFAQPayload, UpdateFAQPayload } from './types';

export async function getActiveKnowledgeEntries(): Promise<KnowledgeEntry[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('voice_agent_knowledge')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      title: row.title as string,
      category: row.category as string,
      content: row.content as string,
      sourceType: (row.source_type as 'manual' | 'cms' | 'database') || 'manual',
      sourceReference: row.source_reference as string | undefined,
      active: row.active as boolean,
      priority: row.priority as number,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    }));
  } catch (err) {
    console.error('getActiveKnowledgeEntries error:', err);
    return [];
  }
}

export async function searchKnowledgeEntries(query: string, category?: string): Promise<KnowledgeEntry[]> {
  const adminClient = createServiceRoleClient();

  try {
    let dbQuery = adminClient
      .from('voice_agent_knowledge')
      .select('*')
      .eq('active', true);

    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    const { data, error } = await dbQuery
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;

    let entries = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      content: row.content,
      sourceType: (row.source_type as 'manual' | 'cms' | 'database') || 'manual',
      sourceReference: row.source_reference,
      active: row.active,
      priority: row.priority,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      entries = entries.filter(
        entry =>
          entry.title.toLowerCase().includes(lowerQuery) ||
          entry.content.toLowerCase().includes(lowerQuery) ||
          entry.category.toLowerCase().includes(lowerQuery)
      );
    }

    return entries;
  } catch (err: any) {
    console.error('searchKnowledgeEntries error:', err);
    return [];
  }
}

export async function getKnowledgeEntryById(id: string): Promise<KnowledgeEntry | null> {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('voice_agent_knowledge')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      category: data.category,
      content: data.content,
      sourceType: (data.source_type as 'manual' | 'cms' | 'database') || 'manual',
      sourceReference: data.source_reference,
      active: data.active,
      priority: data.priority,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (err: any) {
    console.error('getKnowledgeEntryById error:', err);
    return null;
  }
}

export async function createKnowledgeEntry(payload: CreateKnowledgePayload): Promise<KnowledgeEntry | null> {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('voice_agent_knowledge')
      .insert({
        title: payload.title,
        category: payload.category,
        content: payload.content,
        source_type: payload.sourceType || 'manual',
        source_reference: payload.sourceReference || null,
        active: payload.active ?? true,
        priority: payload.priority ?? 0,
      })
      .select()
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      category: data.category,
      content: data.content,
      sourceType: (data.source_type as 'manual' | 'cms' | 'database') || 'manual',
      sourceReference: data.source_reference,
      active: data.active,
      priority: data.priority,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (err: any) {
    console.error('createKnowledgeEntry error:', err);
    return null;
  }
}

export async function updateKnowledgeEntry(payload: UpdateKnowledgePayload): Promise<boolean> {
  const adminClient = createServiceRoleClient();

  try {
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.category !== undefined) updateData.category = payload.category;
    if (payload.content !== undefined) updateData.content = payload.content;
    if (payload.sourceType !== undefined) updateData.source_type = payload.sourceType;
    if (payload.sourceReference !== undefined) updateData.source_reference = payload.sourceReference;
    if (payload.active !== undefined) updateData.active = payload.active;
    if (payload.priority !== undefined) updateData.priority = payload.priority;

    const { error } = await adminClient
      .from('voice_agent_knowledge')
      .update(updateData)
      .eq('id', payload.id);

    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error('updateKnowledgeEntry error:', err);
    return false;
  }
}

export async function deleteKnowledgeEntry(id: string): Promise<boolean> {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient
      .from('voice_agent_knowledge')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error('deleteKnowledgeEntry error:', err);
    return false;
  }
}

export async function getActiveFAQs(): Promise<FAQEntry[]> {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('voice_agent_faqs')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category,
      active: row.active,
      priority: row.priority,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (err: any) {
    console.error('getActiveFAQs error:', err);
    return [];
  }
}

export async function searchFAQs(query: string, category?: string): Promise<FAQEntry[]> {
  const adminClient = createServiceRoleClient();

  try {
    let dbQuery = adminClient
      .from('voice_agent_faqs')
      .select('*')
      .eq('active', true);

    if (category) {
      dbQuery = dbQuery.eq('category', category);
    }

    const { data, error } = await dbQuery
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;

    let entries = (data || []).map((row: any) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category,
      active: row.active,
      priority: row.priority,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      entries = entries.filter(
        entry =>
          entry.question.toLowerCase().includes(lowerQuery) ||
          entry.answer.toLowerCase().includes(lowerQuery) ||
          entry.category.toLowerCase().includes(lowerQuery)
      );
    }

    return entries;
  } catch (err: any) {
    console.error('searchFAQs error:', err);
    return [];
  }
}

export async function getFAQById(id: string): Promise<FAQEntry | null> {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('voice_agent_faqs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      question: data.question,
      answer: data.answer,
      category: data.category,
      active: data.active,
      priority: data.priority,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (err: any) {
    console.error('getFAQById error:', err);
    return null;
  }
}

export async function createFAQ(payload: CreateFAQPayload): Promise<FAQEntry | null> {
  const adminClient = createServiceRoleClient();

  try {
    const { data, error } = await adminClient
      .from('voice_agent_faqs')
      .insert({
        question: payload.question,
        answer: payload.answer,
        category: payload.category,
        active: payload.active ?? true,
        priority: payload.priority ?? 0,
      })
      .select()
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      question: data.question,
      answer: data.answer,
      category: data.category,
      active: data.active,
      priority: data.priority,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (err: any) {
    console.error('createFAQ error:', err);
    return null;
  }
}

export async function updateFAQ(payload: UpdateFAQPayload): Promise<boolean> {
  const adminClient = createServiceRoleClient();

  try {
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

    if (payload.question !== undefined) updateData.question = payload.question;
    if (payload.answer !== undefined) updateData.answer = payload.answer;
    if (payload.category !== undefined) updateData.category = payload.category;
    if (payload.active !== undefined) updateData.active = payload.active;
    if (payload.priority !== undefined) updateData.priority = payload.priority;

    const { error } = await adminClient
      .from('voice_agent_faqs')
      .update(updateData)
      .eq('id', payload.id);

    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error('updateFAQ error:', err);
    return false;
  }
}

export async function deleteFAQ(id: string): Promise<boolean> {
  const adminClient = createServiceRoleClient();

  try {
    const { error } = await adminClient
      .from('voice_agent_faqs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error('deleteFAQ error:', err);
    return false;
  }
}
