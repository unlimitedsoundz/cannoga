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
      render: (entry: KnowledgeEntry) => <span className="font-medium text-neutral-900">{entry.title}</span>,
    },
    { key: 'category', header: 'Category', render: (entry: KnowledgeEntry) => <span className="text-xs uppercase tracking-wider">{entry.category}</span> },
    {
      key: 'content',
      header: 'Content Preview',
      render: (entry: KnowledgeEntry) => <span className="text-xs text-neutral-500 line-clamp-2">{entry.content.slice(0, 100)}...</span>,
    },
    {
      key: 'active',
      header: 'Status',
      render: (entry: KnowledgeEntry) => <StatusBadge status={entry.active ? 'active' : 'inactive'} />,
    },
    {
      key: 'source_type',
      header: 'Source',
      render: (entry: KnowledgeEntry) => <span className="text-xs text-neutral-500">{entry.sourceType}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (entry: KnowledgeEntry) => (
        <div className="flex items-center gap-2">
          <button onClick={() => startEditKnowledge(entry)} className="text-neutral-400 hover:text-neutral-600"><HugeiconsIcon icon={Edit} size={16} /></button>
          <button onClick={() => handleDeleteKnowledge(entry.id)} className="text-neutral-400 hover:text-red-600"><HugeiconsIcon icon={Trash} size={16} /></button>
        </div>
      ),
    },
  ];

  const faqColumns = [
    {
      key: 'question',
      header: 'Question',
      render: (faq: FAQEntry) => <span className="font-medium text-neutral-900">{faq.question}</span>,
    },
    {
      key: 'answer',
      header: 'Answer Preview',
      render: (faq: FAQEntry) => <span className="text-xs text-neutral-500 line-clamp-2">{faq.answer.slice(0, 120)}...</span>,
    },
    { key: 'category', header: 'Category', render: (faq: FAQEntry) => <span className="text-xs uppercase tracking-wider">{faq.category}</span> },
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
          <button onClick={() => startEditFAQ(faq)} className="text-neutral-400 hover:text-neutral-600"><HugeiconsIcon icon={Edit} size={16} /></button>
          <button onClick={() => handleDeleteFAQ(faq.id)} className="text-neutral-400 hover:text-red-600"><HugeiconsIcon icon={Trash} size={16} /></button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        subtitle="Manage voice agent knowledge entries and FAQs"
        actions={
          activeTab === 'knowledge' ? (
            <button onClick={startCreateKnowledge} className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors">
              <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add Knowledge
            </button>
          ) : (
            <button onClick={startCreateFAQ} className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors">
              <HugeiconsIcon icon={Plus} size={14} strokeWidth={2.5} /> Add FAQ
            </button>
          )
        }
      />

      {message && (
        <div className={`p-4 border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="flex items-center gap-1 border-b border-neutral-200">
        <button
          onClick={() => { setActiveTab('knowledge'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${activeTab === 'knowledge' ? 'border-b-2 border-[#9c27b3] text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
        >
          Knowledge Entries
        </button>
        <button
          onClick={() => { setActiveTab('faqs'); setSearchQuery(''); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${activeTab === 'faqs' ? 'border-b-2 border-[#9c27b3] text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
        >
          FAQs
        </button>
      </div>

      <div className="max-w-md">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={`Search ${activeTab}...`} />
      </div>

      {(isCreating || editingEntry) && activeTab === 'knowledge' && (
        <div className="bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">{editingEntry ? 'Edit Knowledge Entry' : 'New Knowledge Entry'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Title</label>
              <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Content</label>
            <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={4} className="w-full p-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Source Type</label>
              <select value={formData.sourceType} onChange={e => setFormData({ ...formData, sourceType: e.target.value })} className="w-full p-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none">
                <option value="manual">Manual</option>
                <option value="cms">CMS</option>
                <option value="database">Database</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Priority</label>
              <input type="number" value={formData.priority} onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })} className="w-full p-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({ ...formData, active: e.target.checked })} className="w-4 h-4 text-[#9c27b3] border-neutral-300 rounded focus:ring-[#9c27b3]" />
              <label htmlFor="active" className="text-xs font-bold uppercase tracking-wider text-neutral-500">Active</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => editingEntry ? handleUpdateKnowledge({ id: editingEntry.id, ...formData }) : handleCreateKnowledge(formData)}
              disabled={saving}
              className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingEntry ? 'Update' : 'Create'}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-sm hover:border-neutral-400 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {(isCreating || editingFAQ) && activeTab === 'faqs' && (
        <div className="bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">{editingFAQ ? 'Edit FAQ' : 'New FAQ'}</h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Question</label>
            <input type="text" value={faqFormData.question} onChange={e => setFaqFormData({ ...faqFormData, question: e.target.value })} className="w-full p-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Answer</label>
            <textarea value={faqFormData.answer} onChange={e => setFaqFormData({ ...faqFormData, answer: e.target.value })} rows={3} className="w-full p-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Category</label>
              <select value={faqFormData.category} onChange={e => setFaqFormData({ ...faqFormData, category: e.target.value })} className="w-full p-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none">
                <option value="general">General</option>
                <option value="admissions">Admissions</option>
                <option value="programs">Programs</option>
                <option value="tuition">Tuition</option>
                <option value="deadlines">Deadlines</option>
                <option value="housing">Housing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">Priority</label>
              <input type="number" value={faqFormData.priority} onChange={e => setFaqFormData({ ...faqFormData, priority: parseInt(e.target.value) || 0 })} className="w-full p-2 text-sm border border-neutral-200 focus:border-neutral-400 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="faq-active" checked={faqFormData.active} onChange={e => setFaqFormData({ ...faqFormData, active: e.target.checked })} className="w-4 h-4 text-[#9c27b3] border-neutral-300 rounded focus:ring-[#9c27b3]" />
              <label htmlFor="faq-active" className="text-xs font-bold uppercase tracking-wider text-neutral-500">Active</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => editingFAQ ? handleUpdateFAQ({ id: editingFAQ.id, ...faqFormData }) : handleCreateFAQ(faqFormData)}
              disabled={saving}
              className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingFAQ ? 'Update' : 'Create'}
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 bg-white border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-sm hover:border-neutral-400 transition-colors">
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
