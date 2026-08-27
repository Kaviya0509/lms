import React, { useState } from 'react';
import { Award, Shield, Eye, Download, Sparkles } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { mockCertificates } from '../../services/mockData';
import type { Certificate, TableColumn } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../../hooks/useToast';

const CertificateListPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [viewCert, setViewCert] = useState<Certificate | null>(null);
  const toast = useToast();

  const handleIssueManual = () => {
    const newCert: Certificate = {
      id: String(Date.now()),
      courseId: 'c1',
      courseName: 'Full Stack Web Development',
      traineeId: 'tr1',
      traineeName: 'Aarav Sharma',
      issuedAt: new Date().toISOString().split('T')[0],
      status: 'issued',
      verificationCode: `LMS-2024-CERT-00${certificates.length + 1}`,
      minScore: 70,
      minAttendance: 80,
    };
    setCertificates(prev => [newCert, ...prev]);
    toast.success('Certificate issued to Aarav Sharma!');
  };

  const columns: TableColumn<Certificate>[] = [
    { key: 'verificationCode', label: 'Verification Code', className: 'min-w-[150px]', render: (v) => <span className="font-mono text-xs text-primary-600 font-semibold whitespace-nowrap">{String(v)}</span> },
    { key: 'traineeName', label: 'Trainee Name', className: 'min-w-[150px]', render: (v) => <span className="font-semibold text-slate-900 text-sm whitespace-nowrap">{String(v)}</span> },
    { key: 'courseName', label: 'Course', className: 'min-w-[220px]', render: (v) => <span className="text-xs text-slate-700 whitespace-nowrap">{String(v)}</span> },
    { key: 'issuedAt', label: 'Issued Date', className: 'min-w-[120px]', render: (v) => <span className="text-xs whitespace-nowrap">{formatDate(String(v))}</span> },
    { key: 'minScore', label: 'Req. Score', className: 'min-w-[110px]', render: (v) => <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap">≥ {String(v)}%</span> },
    { key: 'minAttendance', label: 'Req. Attendance', className: 'min-w-[140px]', render: (v) => <span className="text-xs font-semibold text-cyan-600 whitespace-nowrap">≥ {String(v)}%</span> },
    { key: 'status', label: 'Status', className: 'min-w-[100px]', render: (_, r) => <StatusBadge status={r.status} dot /> },
  ];

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Certificate Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Automated and manual certificate generation and verification</p>
        </div>
        <Button icon={<Sparkles size={15} />} onClick={handleIssueManual}>Issue Certificate</Button>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Award size={20} className="text-primary-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary-700">Automated Issuance Rules</p>
            <p className="text-xs text-primary-600/80 mt-0.5">Certificates are automatically generated when a trainee achieves ≥ configured passing score AND ≥ required attendance %.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex-1 flex flex-col min-h-0">
        <DataTable
          columns={columns as unknown as TableColumn<Record<string, unknown>>[]}
          data={certificates as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search certificates by code or trainee..."
          actions={(row) => {
            const cert = row as unknown as Certificate;
            return (
              <div className="flex items-center gap-1.5 justify-end">
                <Button variant="ghost" size="xs" icon={<Eye size={13} />} onClick={() => setViewCert(cert)} />
                <Button variant="ghost" size="xs" icon={<Download size={13} />} onClick={() => toast.info('Certificate PDF download started...')} />
              </div>
            );
          }}
        />
      </div>

      <Modal isOpen={!!viewCert} onClose={() => setViewCert(null)} title="Certificate Preview" size="lg">
        {viewCert && (
          <div className="space-y-6">
            <div className="border-4 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-primary-50 p-8 rounded-2xl text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-4 right-4"><Shield size={28} className="text-amber-300" /></div>
              <div className="flex justify-center"><Award size={48} className="text-amber-500" /></div>
              <p className="text-xs uppercase tracking-widest text-amber-600 font-bold">Certificate of Completion</p>
              <p className="text-slate-500 text-xs">This is to certify that</p>
              <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-wide">{viewCert.traineeName}</h2>
              <p className="text-slate-500 text-xs">has successfully completed the course</p>
              <h3 className="text-lg font-semibold text-primary-600">{viewCert.courseName}</h3>
              <div className="pt-4 border-t border-amber-200 flex justify-between text-xs text-slate-500">
                <span>Issued Date: {formatDate(viewCert.issuedAt)}</span>
                <span className="font-mono text-slate-500">Code: {viewCert.verificationCode}</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setViewCert(null)}>Close</Button>
              <Button icon={<Download size={14} />} onClick={() => toast.info('Downloading Certificate PDF...')}>Download PDF</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CertificateListPage;
