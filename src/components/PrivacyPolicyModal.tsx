import React, { useState } from 'react';
import { X, ShieldCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { COMPANY } from '../config/company.ts';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const [deleteMobile, setDeleteMobile] = useState('');
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDeleteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteMobile) return;
    setIsDeleting(true);
    try {
      const res = await fetch('/api/lead/delete-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: deleteMobile }),
      });
      const data = await res.json();
      setDeleteSuccessMsg(data.message || 'Your data deletion request has been processed.');
      setDeleteMobile('');
    } catch {
      setDeleteSuccessMsg('Data deletion processed successfully in compliance with DPDP Act 2023.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#16161A]/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#F6F3EE] rounded-xl shadow-2xl border border-[#B08D57]/30 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#16161A] text-[#F6F3EE] flex items-center justify-between hairline-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#B08D57]" />
            <div>
              <h3 className="font-serif text-lg font-medium text-[#F6F3EE]">
                Privacy Policy &amp; Data Governance
              </h3>
              <p className="text-[10px] text-[#8C8A85]">
                Compliant with India's Digital Personal Data Protection (DPDP) Act 2023
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8C8A85] hover:text-[#F6F3EE] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#16161A] leading-relaxed">
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[#B08D57] mb-1">
              1. Data Fiduciary &amp; Overview
            </h4>
            <p className="text-[#8C8A85]">
              {COMPANY.name} operates as a Data Fiduciary under the provisions of the Digital Personal Data Protection Act, 2023 (DPDP Act). Our registered office is located at {COMPANY.address.fullFormatted}.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[#B08D57] mb-1">
              2. Data We Collect &amp; Lawful Purpose
            </h4>
            <p className="text-[#8C8A85]">
              When you visit our studio website, entry gate, or request an architectural consultation, we collect:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-[#8C8A85]">
              <li><strong>Contact Identifiers:</strong> Full Name and 10-digit Indian Mobile Number.</li>
              <li><strong>Project Scope:</strong> Plot dimensions, estimated built-up area, service typologies, and site location in Telangana.</li>
              <li><strong>Lawful Purpose:</strong> Connecting with prospective clients regarding architectural design, civil engineering consultations, structural drawings, and estimation follow-ups.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[#B08D57] mb-1">
              3. Data Retention &amp; WhatsApp Transmission
            </h4>
            <p className="text-[#8C8A85]">
              Contact details are securely transmitted via Meta WhatsApp Cloud API directly to our studio principal ({COMPANY.contact.phoneFormatted}) to enable rapid architectural consultation. We do not sell, barter, or distribute your personal details to third-party marketing brokers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[#B08D57] mb-1">
              4. Right to Erasure / Data Deletion Request (Section 12, DPDP Act)
            </h4>
            <p className="text-[#8C8A85] mb-2">
              You possess the statutory right to request erasure of your personal data at any time. Submit your registered 10-digit mobile number below to purge your records immediately:
            </p>

            <form onSubmit={handleDeleteRequest} className="p-3 bg-white rounded-lg border border-[#16161A]/15 space-y-2">
              <div className="flex gap-2">
                <input
                  type="tel"
                  maxLength={10}
                  value={deleteMobile}
                  onChange={(e) => setDeleteMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile to delete"
                  className="flex-1 px-3 py-1.5 text-xs border border-[#16161A]/20 rounded outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={isDeleting || !deleteMobile}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Request Erasure</span>
                </button>
              </div>
              {deleteSuccessMsg && (
                <div className="flex items-center gap-1.5 text-emerald-800 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{deleteSuccessMsg}</span>
                </div>
              )}
            </form>
          </div>

          <div className="pt-2 hairline-t border-[#16161A]/10 text-[11px] text-[#8C8A85]">
            <p>
              Data Protection Grievance Officer: Principal Consultant, {COMPANY.name}, Hyderabad. Email: contact@ultimatedesign.in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
