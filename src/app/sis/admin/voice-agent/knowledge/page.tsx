'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/sis/PageHeader';
import { DataTable } from '@/components/sis/DataTable';
import { SearchBar } from '@/components/sis/SearchBar';
import { StatusBadge } from '@/components/sis/StatusBadge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon as Plus,
  Trash as Trash,
  Edit01Icon as Edit,
} from '@hugeicons/core-free-icons';
import { createKnowledgeEntry, getActiveKnowledgeEntries, updateKnowledgeEntry, deleteKnowledgeEntry, createFAQ, getActiveFAQs, updateFAQ, deleteFAQ } from '@/lib/voice/knowledge';
import type { KnowledgeEntry, FAQEntry, CreateKnowledgePayload, UpdateKnowledgePayload, CreateFAQPayload, UpdateFAQPayload } from '@/lib/voice/types';

type Tab = 'knowledge' | 'faqs';

export default function VoiceAgentKnowledgePage() {
  const [activeTab, setActiveTab] = useState<Tab>('knowledge');
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([]);
  const [faqEntries, setFaqEntries] = useState<FAQEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const emptyKnowledge: CreateKnowledgePayload = { title: '', category: 'general', content: '', sourceType: 'manual', active: true, priority: 0 };
  const emptyFAQ: CreateFAQPayload = { question: '', answer: '', category: 'general', active: true, priority: 0 };

  const [formData, setFormData] = useState<CreateKnowledgePayload>(emptyKnowledge);
  const [faqFormData, setFaqFormData] = useState<CreateFAQPayload>(emptyFAQ);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    try {
      const [knowledge, faqs] = await Promise.all([getActiveKnowledgeEntries(), getActiveFAQs()]);
      setKnowledgeEntries(knowledge);
      setFaqEntries(faqs);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to load knowledge base' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [knowledge, faqs] = await Promise.all([getActiveKnowledgeEntries(), getActiveFAQs()]);
        if (!cancelled) {
          setKnowledgeEntries(knowledge);
          setFaqEntries(faqs);
        }
      } catch (err) {
        if (!cancelled) {
          setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to load knowledge base' });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateKnowledge = async (payload: CreateKnowledgePayload) => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await createKnowledgeEntry(payload);
      if (result) {
        setMessage({ type: 'success', text: 'Knowledge entry created successfully' });
        setFormData(emptyKnowledge);
        setIsCreating(false);
        fetchData();
      } else {
        setMessage({ type: 'error', text: 'Failed to create knowledge entry' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create knowledge entry' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateKnowledge = async (payload: UpdateKnowledgePayload) => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await updateKnowledgeEntry(payload);
      if (result) {
        setMessage({ type: 'success', text: 'Knowledge entry updated successfully' });
        setEditingEntry(null);
        setFormData(emptyKnowledge);
        fetchData();
      } else {
        setMessage({ type: 'error', text: 'Failed to update knowledge entry' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update knowledge entry' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKnowledge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this knowledge entry?')) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await deleteKnowledgeEntry(id);
      if (result) {
        setMessage({ type: 'success', text: 'Knowledge entry deleted successfully' });
        fetchData();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete knowledge entry' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete knowledge entry' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFAQ = async (payload: CreateFAQPayload) => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await createFAQ(payload);
      if (result) {
        setMessage({ type: 'success', text: 'FAQ created successfully' });
        setFaqFormData(emptyFAQ);
        setIsCreating(false);
        fetchData();
      } else {
        setMessage({ type: 'error', text: 'Failed to create FAQ' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to create FAQ' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFAQ = async (payload: UpdateFAQPayload) => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await updateFAQ(payload);
      if (result) {
        setMessage({ type: 'success', text: 'FAQ updated successfully' });
        setEditingFAQ(null);
        setFaqFormData(emptyFAQ);
        fetchData();
      } else {
        setMessage({ type: 'error', text: 'Failed to update FAQ' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update FAQ' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await deleteFAQ(id);
      if (result) {
        setMessage({ type: 'success', text: 'FAQ deleted successfully' });
        fetchData();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete FAQ' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete FAQ' });
    } finally {
      setSaving(false);
    }
  };

  const startEditKnowledge = (entry: KnowledgeEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      category: entry.category,
      content: entry.content,
      sourceType: entry.sourceType,
      sourceReference: entry.sourceReference || '',
      active: entry.active,
      priority: entry.priority,
    });
    setIsCreating(false);
    setEditingFAQ(null);
    setFaqFormData(emptyFAQ);
  };

  const startEditFAQ = (faq: FAQEntry) => {
    setEditingFAQ(faq);
    setFaqFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      active: faq.active,
      priority: faq.priority,
    });
    setIsCreating(false);
    setEditingEntry(null);
    setFormData(emptyKnowledge);
  };

  const startCreateKnowledge = () => {
    setIsCreating(true);
    setEditingEntry(null);
    setFormData(emptyKnowledge);
    setEditingFAQ(null);
    setFaqFormData(emptyFAQ);
  };

  const startCreateFAQ = () => {
    setIsCreating(true);
    setEditingFAQ(null);
    setFaqFormData(emptyFAQ);
    setEditingEntry(null);
    setFormData(emptyKnowledge);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingEntry(null);
    setEditingFAQ(null);
    setFormData(emptyKnowledge);
    setFaqFormData(emptyFAQ);
    setMessage(null);
  };

  const filteredKnowledge = knowledgeEntries.filter(k => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return k.title.toLowerCase().includes(q) || k.content.toLowerCase().includes(q) || k.category.toLowerCase().includes(q);
  });

  const filteredFAQs = faqEntries.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
  });

  const knowledgeColumns = [
    {
      key: 'title',
      header: 'Title',
      render: (entry: KnowledgeEntry) => <span className="font-medium text-white">{entry.title}</span>,
    },
    { key: 'category', header: 'Category', render: (entry: KnowledgeEntry) => <span className="text-xs uppercase tracking-wider text-slate-400">{entry.category}</span> },
    {
      key: 'content',
      header: 'Content Preview',
      render: (entry: KnowledgeEntry) => <span className="text-xs text-slate-400 line-clamp-2">{entry.content.slice(0, 100)}...</span>,
    },
    {
      key: 'active',
      header: 'Status',
      render: (entry: KnowledgeEntry) => <StatusBadge status={entry.active ? 'active' : 'inactive'} />,
    },
    {
      key: 'source_type',
      header: 'Source',
      render: (entry: KnowledgeEntry) => <span className="text-xs text-slate-400">{entry.sourceType}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (entry: KnowledgeEntry) => (
        <div className="flex items-center gap-2">
          <button onClick={() => startEditKnowledge(entry)} className="text-slate-400 hover:text-white transition-colors"><HugeiconsIcon icon={Edit} size={16} /></button>
          <button onClick={() => handleDeleteKnowledge(entry.id)} className="text-slate-400 hover:text-red-400 transition-colors"><HugeiconsIcon icon={Trash} size={16} /></button>
        </div>
      ),
    },
  ];

  const faqColumns = [
    {
      key: 'question',
      header: 'Question',
      render: (faq: FAQEntry) => <span className="font-medium text-white">{faq.question}</span>,
    },
    {
      key: 'answer',
      header: 'Answer Preview',
      render: (faq: FAQEntry) => <span className="text-xs text-slate-400 line-clamp-2">{faq.answer.slice(0, 120)}...</span>,
    },
    { key: 'category', header: 'Category', render: (faq: FAQEntry) => <span className="text-xs uppercase tracking-wider text-slate-400">{faq.category}</span> },
    {
      key: 'active',
      header: 'Status',
      render: (faq: FAQEntry) => <StatusBadge status={faq.active ? 'active' : 'inactive'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (faq: FAQEntry) => (
        <div className="flex items-center gap-2">
          <button onClick={() => startEditFAQ(faq)} className="text-slate-400 hover:text-white transition-colors"><HugeiconsIcon icon={Edit} size={16} /></button>
          <button onClick={() => handleDeleteFAQ(faq.id)} className="text-slate-400 hover:text-red-400 transition-colors"><HugeiconsIcon icon={Trash} size={16} /></button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        subtitle="Manage voice agent knowledge entries and FAQs"
        actions={
          activeTab === 'knowledge' ? (
            <button onClick={startCreateKnowledge} className="inline-flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors">
              <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Knowledge
            </button>
          ) : (
            <button onClick={startCreateFAQ} className="inline-flex items-center gap-2 px-4 py-2 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors">
              <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add FAQ
            </button>
          )
        }
      />

      {message && (
        <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-emerald-950/60 text-emerald-300' : 'bg-red-950/60 text-red-300'}`}>
          <p className="text-xs font-bold uppercase tracking-wider">{message.text}</p>
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <button
          onClick={() => { setActiveTab('knowledge'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors ${activeTab === 'knowledge' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Knowledge Entries
        </button>
        <button
          onClick={() => { setActiveTab('faqs'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors ${activeTab === 'faqs' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          FAQs
        </button>
      </div>

      <div className="max-w-md">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={`Search ${activeTab}...`} />
      </div>

      {(isCreating || editingEntry) && activeTab === 'knowledge' && (
        <div className="bg-neutral-900 rounded-2xl p-6 space-y-4 shadow-sm text-white">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{editingEntry ? 'Edit Knowledge Entry' : 'New Knowledge Entry'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 text-sm bg-white/5 text-white rounded-xl focus:outline-none focus:bg-white/10" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none">
                <option value="general">General</option>
                <option value="admissions">Admissions</option>
                <option value="programs">Programs</option>
                <option value="schools">Schools</option>
                <option value="tuition">Tuition</option>
                <option value="deadlines">Deadlines</option>
                <option value="intakes">Intakes</option>
                <option value="international_students">International Students</option>
                <option value="application_process">Application Process</option>
                <option value="requirements">Requirements</option>
                <option value="PAL">PAL</option>
                <option value="housing">Housing</option>
                <option value="student_services">Student Services</option>
                <option value="faqs">FAQs</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Content</label>
            <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={4} className="w-full p-3 text-sm bg-white/5 text-white rounded-xl focus:outline-none focus:bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Source Type</label>
              <select value={formData.sourceType} onChange={e => setFormData({ ...formData, sourceType: e.target.value })} className="w-full p-3 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none">
                <option value="manual">Manual</option>
                <option value="cms">CMS</option>
                <option value="database">Database</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Priority</label>
              <input type="number" value={formData.priority} onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })} className="w-full p-3 text-sm bg-white/5 text-white rounded-xl focus:outline-none focus:bg-white/10" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} className="w-4 h-4 text-[#9c27b3] rounded" />
              <label htmlFor="active" className="text-xs font-bold uppercase tracking-wider text-slate-400">Active</label>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => editingEntry ? handleUpdateKnowledge({ id: editingEntry.id, ...formData }) : handleCreateKnowledge(formData)}
              disabled={saving}
              className="px-4 py-2 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingEntry ? 'Update' : 'Create'}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {(isCreating || editingFAQ) && activeTab === 'faqs' && (
        <div className="bg-neutral-900 rounded-2xl p-6 space-y-4 shadow-sm text-white">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{editingFAQ ? 'Edit FAQ' : 'New FAQ'}</h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Question</label>
            <input type="text" value={faqFormData.question} onChange={e => setFaqFormData({ ...faqFormData, question: e.target.value })} className="w-full p-3 text-sm bg-white/5 text-white rounded-xl focus:outline-none focus:bg-white/10" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Answer</label>
            <textarea value={faqFormData.answer} onChange={e => setFaqFormData({ ...faqFormData, answer: e.target.value })} rows={3} className="w-full p-3 text-sm bg-white/5 text-white rounded-xl focus:outline-none focus:bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Category</label>
              <select value={faqFormData.category} onChange={e => setFaqFormData({ ...faqFormData, category: e.target.value })} className="w-full p-3 text-sm bg-neutral-800 text-white rounded-xl focus:outline-none">
                <option value="general">General</option>
                <option value="admissions">Admissions</option>
                <option value="programs">Programs</option>
                <option value="tuition">Tuition</option>
                <option value="deadlines">Deadlines</option>
                <option value="housing">Housing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Priority</label>
              <input type="number" value={faqFormData.priority} onChange={e => setFaqFormData({ ...faqFormData, priority: parseInt(e.target.value) || 0 })} className="w-full p-3 text-sm bg-white/5 text-white rounded-xl focus:outline-none focus:bg-white/10" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="faq-active" checked={faqFormData.active} onChange={e => setFaqFormData({ ...faqFormData, active: e.target.checked })} className="w-4 h-4 text-[#9c27b3] rounded" />
              <label htmlFor="faq-active" className="text-xs font-bold uppercase tracking-wider text-slate-400">Active</label>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => editingFAQ ? handleUpdateFAQ({ id: editingFAQ.id, ...faqFormData }) : handleCreateFAQ(faqFormData)}
              disabled={saving}
              className="px-4 py-2 bg-[#9c27b3] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingFAQ ? 'Update' : 'Create'}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeTab === 'knowledge' && (
        <DataTable
          columns={knowledgeColumns}
          data={filteredKnowledge}
          keyField="id"
          emptyMessage="No knowledge entries found"
        />
      )}

      {activeTab === 'faqs' && (
        <DataTable
          columns={faqColumns}
          data={filteredFAQs}
          keyField="id"
          emptyMessage="No FAQs found"
        />
      )}
    </div>
  );
}
