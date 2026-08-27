import React, { useState } from 'react';
import { Download } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';

const chartBase = {
  chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter, sans-serif' },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
  tooltip: { theme: 'light' as const },
  theme: { mode: 'light' as const },
  dataLabels: { enabled: false },
};

const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<'enrollment' | 'attendance' | 'assessment' | 'trainer' | 'certificate' | 'course'>('enrollment');
  const toast = useToast();

  const reportConfigs: Record<string, { title: string; series: { name: string; data: number[] }[]; categories: string[]; color: string }> = {
    enrollment: { title: 'Monthly Enrollments', series: [{ name: 'Total Enrollments', data: [65, 88, 110, 145, 178, 210, 245, 280] }], categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], color: '#DE896A' },
    attendance: { title: 'Average Batch Attendance %', series: [{ name: 'Attendance %', data: [88, 62, 96, 55, 80] }], categories: ['FSWD-Aug', 'MLP-Online', 'FSWD-Batch2', 'CEH-Batch', 'UIUX-Boot'], color: '#F4A261' },
    assessment: { title: 'Pass Rates by Course', series: [{ name: 'Pass %', data: [85, 78, 92, 64] }], categories: ['FSWD', 'MLP', 'UX', 'CEH'], color: '#E9C46A' },
    trainer: { title: 'Trainer Effectiveness Rating', series: [{ name: 'Avg Rating', data: [4.8, 4.9, 4.6, 4.7, 4.5] }], categories: ['Dr. Arun', 'Meena S.', 'Rajesh P.', 'Divya R.', 'Suresh N.'], color: '#F8C090' },
    certificate: { title: 'Certificates Issued Count', series: [{ name: 'Certificates', data: [42, 68, 94, 120, 155] }], categories: ['Mar', 'Apr', 'May', 'Jun', 'Jul'], color: '#FBCBB0' },
    course: { title: 'Course Completion Rates', series: [{ name: 'Completion %', data: [72, 84, 91, 60] }], categories: ['FSWD', 'MLP', 'UX', 'CEH'], color: '#FFD8C2' },
  };

  const current = reportConfigs[reportType];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Generate, analyze and export institutional telemetry and reports</p>
        </div>
        <Button icon={<Download size={15} />} onClick={() => toast.success(`Exporting ${reportType} report to CSV/PDF...`)}>Export Report</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['enrollment', 'attendance', 'assessment', 'trainer', 'certificate', 'course'] as const).map(t => (
          <button key={t} onClick={() => setReportType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${reportType === t ? 'bg-primary-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]' : 'bg-white border border-slate-100 shadow-sm text-slate-500 hover:text-slate-900'}`}>
            {t} Report
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">{current.title}</h2>
        <ReactApexChart
          type="bar"
          height={320}
          series={current.series}
          options={{
            ...chartBase,
            colors: [current.color],
            plotOptions: { bar: { borderRadius: 8, columnWidth: '45%' } },
            xaxis: { categories: current.categories, labels: { style: { colors: '#64748b', fontSize: '12px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
            yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' } } },
          }}
        />
      </div>
    </div>
  );
};

export default ReportsPage;
