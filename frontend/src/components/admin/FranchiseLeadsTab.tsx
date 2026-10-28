import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  FileText,
  Cloud,
} from 'lucide-react';
import {
  FranchiseLead,
  getStoredFranchiseLeads,
  saveStoredFranchiseLeads,
} from '../../data/franchiseLeads';
import {
  fetchPuppyFranchiseLeadsFromSupabase,
  updatePuppyFranchiseLeadInSupabase,
} from '../../lib/supabase';

interface FranchiseLeadsTabProps {
  onNotify: (msg: string) => void;
}

export const FranchiseLeadsTab: React.FC<FranchiseLeadsTabProps> = ({ onNotify }) => {
  const [leads, setLeads] = useState<FranchiseLead[]>(() => getStoredFranchiseLeads());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLead, setActiveLead] = useState<FranchiseLead | null>(null);

  // Sync with live Supabase on mount
  useEffect(() => {
    fetchPuppyFranchiseLeadsFromSupabase().then((remoteLeads) => {
      if (remoteLeads && remoteLeads.length > 0) {
        setLeads(remoteLeads);
        saveStoredFranchiseLeads(remoteLeads);
      }
    });
  }, []);

  const handleUpdateStatus = (leadId: string, nextStatus: FranchiseLead['status']) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l));
    setLeads(updated);
    saveStoredFranchiseLeads(updated);
    if (activeLead && activeLead.id === leadId) {
      setActiveLead({ ...activeLead, status: nextStatus });
    }
    // Sync to Supabase
    updatePuppyFranchiseLeadInSupabase(leadId, nextStatus);
    onNotify(`Partner Lead #${leadId} updated to ${nextStatus}`);
  };

  const handleUpdateNotes = (leadId: string, notes: string) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, notes } : l));
    setLeads(updated);
    saveStoredFranchiseLeads(updated);
    const lead = leads.find((l) => l.id === leadId);
    // Sync to Supabase
    if (lead) {
      updatePuppyFranchiseLeadInSupabase(leadId, lead.status, notes);
    }
    onNotify('Internal partner discussion notes saved');
  };

  const filteredLeads = leads.filter((l) => {
    if (selectedStatus !== 'all' && l.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.fullName.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Franchise & Retail Expansion CRM</h2>
          <p className="text-xs text-slate-500">
            Omnichannel store partner leads, high-street location applications, and FOFO/FOCO investments.
          </p>
        </div>

        <div className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          Active Partner Applications: <strong className="text-slate-950 font-black">{leads.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'New', 'Contacted', 'In Discussion', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All Applicants' : status}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city, applicant name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Applicant & Contact</th>
                <th className="py-3 px-4">Location & Territory</th>
                <th className="py-3 px-4">Budget & Area</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setActiveLead(lead)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900">{lead.fullName}</div>
                    <div className="text-[11px] text-slate-500">{lead.email}</div>
                    <div className="text-[11px] text-slate-600 font-mono">{lead.phone}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">
                      {lead.city}, {lead.state}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{lead.currentBusiness}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-black text-amber-700">{lead.investmentBudget}</div>
                    <div className="text-[11px] text-slate-500">{lead.carpetArea}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-700">{lead.expectedTimeline}</div>
                    <div className="text-[10px] text-slate-400">{lead.submittedAt}</div>
                  </td>

                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleUpdateStatus(lead.id, e.target.value as FranchiseLead['status'])
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                        lead.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : lead.status === 'In Discussion'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                          : lead.status === 'Contacted'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : lead.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-purple-50 text-purple-900 border-purple-300'
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLead(lead);
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No franchise leads found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Lead Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-xs font-bold text-amber-600">FRANCHISE PROSPECTUS</div>
                <h3 className="text-xl font-black text-slate-900">{activeLead.fullName}</h3>
                <div className="text-xs text-slate-400">
                  {activeLead.city}, {activeLead.state} &bull; {activeLead.id}
                </div>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Phone Number</span>
                <div className="font-bold text-slate-900 font-mono">{activeLead.phone}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Email Address</span>
                <div className="font-bold text-slate-900 truncate">{activeLead.email}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Investment Budget</span>
                <div className="font-black text-amber-700">{activeLead.investmentBudget}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px] font-bold uppercase">Carpet Area</span>
                <div className="font-bold text-slate-900">{activeLead.carpetArea}</div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-slate-700">Commercial Space Availability:</div>
              <div className="p-3 rounded-xl bg-slate-50 text-slate-800 border border-slate-200">
                {activeLead.commercialSpaceStatus}
              </div>
            </div>

            {activeLead.message && (
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-700">Applicant Cover Letter / Background:</div>
                <div className="p-3.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200 leading-relaxed">
                  &ldquo;{activeLead.message}&rdquo;
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-slate-700">Internal Discussion Notes:</div>
              <textarea
                rows={3}
                defaultValue={activeLead.notes || ''}
                onBlur={(e) => handleUpdateNotes(activeLead.id, e.target.value)}
                placeholder="Log call summary, location feedback, LOI status..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-amber-400 text-xs"
              />
              <span className="text-[10px] text-slate-400">Notes auto-save on blur.</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <a
                href={`tel:${activeLead.phone}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Partner</span>
              </a>

              <button
                onClick={() => setActiveLead(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
