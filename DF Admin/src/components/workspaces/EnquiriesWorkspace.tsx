"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Enquiry, EnquiryStatus, EnquiryType } from '../../types';
import { 
  MessageSquare, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Mail, 
  Phone, 
  Building2, 
  Send, 
  Check, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const EnquiriesWorkspace: React.FC = () => {
  const { enquiries, updateEnquiryStatus, globalSearchQuery } = useApp();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const types: { id: string; label: string }[] = [
    { id: 'all', label: 'All Inquiries' },
    { id: 'media', label: 'Media & Press Accreditation' },
    { id: 'sponsorship_enquiry', label: 'CSR Sponsorship Requests' },
    { id: 'general', label: 'General Devotee Questions' }
  ];

  const statuses: string[] = ['all', 'new', 'in_progress', 'resolved'];

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesType = selectedType === 'all' || enq.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || enq.status === selectedStatus;
    const matchesSearch = !globalSearchQuery || 
      enq.sender_name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      enq.subject.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      enq.message.toLowerCase().includes(globalSearchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new': return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#D9762E]/15 text-[#D9762E] border border-[#D9762E]/30 animate-pulse"><Clock size={12} /> New Request</span>;
      case 'in_progress': return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C9A646]/20 text-[#8A5000] dark:text-[#FFD27F] border border-[#C9A646]/30"><Sparkles size={12} /> In Progress</span>;
      case 'resolved': return <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#401C0C]/15 dark:bg-[#401C0C]/30 text-[#401C0C] dark:text-[#FFD27F] border border-[#401C0C]/30"><CheckCircle2 size={12} /> Resolved</span>;
    }
  };

  const getTypeBadge = (type: EnquiryType) => {
    switch (type) {
      case 'media': return <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase tracking-wider">Press & Media</span>;
      case 'sponsorship_enquiry': return <span className="px-2 py-0.5 rounded bg-[#C9A646]/20 text-[#8A5000] dark:text-[#FFD27F] font-bold text-[10px] uppercase tracking-wider">CSR Sponsor</span>;
      case 'general': return <span className="px-2 py-0.5 rounded bg-[#401C0C]/10 text-[#401C0C] dark:text-[#FFD27F] font-bold text-[10px] uppercase tracking-wider">General Query</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header & Filter Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm flex flex-col justify-between gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1B1C19] dark:text-[#F3F4F6] flex items-center gap-2">
              <MessageSquare className="text-[#D9762E]" /> General Enquiries & Media Press Desk
            </h2>
            <p className="text-xs text-[#867463] dark:text-[#9CA3AF] mt-1">
              Manage press pass accreditations, corporate CSR sponsor messages, and devotee support tickets
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-[#F5F3EE] dark:bg-[#242622] px-3.5 py-2 rounded-xl border border-[#E4E2DD] dark:border-[#30312E]">
            <span className="text-[#D9762E] font-bold">New Unread:</span> {enquiries.filter(e => e.status === 'new').length} Tickets
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#F5F3EE] dark:border-[#2E302A]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#867463] dark:text-[#9CA3AF] mr-2 flex items-center gap-1">
              <Filter size={14} /> Category:
            </span>
            {types.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedType === t.id
                    ? 'bg-[#401C0C] dark:bg-[#FFD27F] text-white dark:text-[#401C0C] font-bold shadow-sm'
                    : 'bg-[#F5F3EE] dark:bg-[#242622] text-[#534436] dark:text-[#D1D5DB] hover:bg-[#EAE8E3]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#F5F3EE] dark:bg-[#242622] p-1 rounded-xl border border-[#E4E2DD] dark:border-[#30312E]">
            {statuses.map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 text-xs rounded-lg uppercase font-bold transition-all cursor-pointer ${
                  selectedStatus === st ? 'bg-white dark:bg-[#1B1C19] text-[#401C0C] dark:text-[#FFD27F] shadow-sm' : 'text-[#867463]'
                }`}
              >
                {st === 'all' ? 'All Status' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiries Cards List */}
      <div className="space-y-4">
        {filteredEnquiries.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#1B1C19] rounded-3xl border border-dashed border-[#E4E2DD] dark:border-[#30312E] text-xs text-[#867463] italic">
            No inquiries matching the selected filters.
          </div>
        ) : (
          filteredEnquiries.map(enq => (
            <div 
              key={enq.id}
              className={`p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border transition-all ${
                enq.status === 'new' 
                  ? 'border-[#D9762E]/60 shadow-md bg-gradient-to-r from-white via-[#FDFBF8] to-[#FFF9F2] dark:from-[#1B1C19] dark:to-[#221F1A]' 
                  : 'border-[#EAE8E3] dark:border-[#30312E] shadow-sm'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#F5F3EE] dark:border-[#2E302A]">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    {getTypeBadge(enq.type)}
                    <span className="text-[11px] text-[#867463] font-mono">Received: {enq.created_at.slice(0, 10)}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1B1C19] dark:text-[#F3F4F6] mt-1">
                    {enq.subject}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-[#534436] dark:text-[#D1D5DB] pt-1">
                    <span className="font-semibold">{enq.sender_name}</span>
                    {enq.organization && (
                      <span className="flex items-center gap-1 text-[#867463]"><Building2 size={12} /> {enq.organization}</span>
                    )}
                    <span className="flex items-center gap-1 text-[#867463] font-mono"><Mail size={12} /> {enq.email}</span>
                    {enq.phone && <span className="flex items-center gap-1 text-[#867463] font-mono"><Phone size={12} /> {enq.phone}</span>}
                  </div>
                </div>
                <div>{getStatusBadge(enq.status)}</div>
              </div>

              <div className="py-4">
                <p className="text-sm text-[#1B1C19] dark:text-[#E5E7EB] leading-relaxed bg-[#F5F3EE]/60 dark:bg-[#242622]/60 p-4 rounded-2xl border border-[#E4E2DD] dark:border-[#30312E]">
                  {enq.message}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-[11px] text-[#867463]">
                  ID: <strong className="font-mono">{enq.id}</strong> • Assigned Desk: <strong className="text-[#401C0C] dark:text-[#FFD27F]">Media & Public Relations</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Simulated Reply: Opening email composer to ${enq.email} with Dhara Foundations letterhead template.`)}
                    className="px-4 py-2 rounded-xl bg-[#F5F3EE] dark:bg-[#242622] text-[#401C0C] dark:text-[#FFD27F] font-semibold text-xs hover:bg-[#EAE8E3] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send size={13} /> Reply via Email
                  </button>

                  {enq.status !== 'in_progress' && enq.status !== 'resolved' && (
                    <button
                      onClick={() => updateEnquiryStatus(enq.id, 'in_progress')}
                      className="px-3.5 py-2 rounded-xl bg-[#C9A646]/20 text-[#8A5000] dark:text-[#FFD27F] font-semibold text-xs hover:bg-[#C9A646] hover:text-white transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles size={13} /> Mark In Progress
                    </button>
                  )}
                  {enq.status !== 'resolved' && (
                    <button
                      onClick={() => updateEnquiryStatus(enq.id, 'resolved')}
                      className="px-4 py-2 rounded-xl bg-[#401C0C] text-white font-semibold text-xs hover:bg-[#5C2913] transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Check size={13} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
