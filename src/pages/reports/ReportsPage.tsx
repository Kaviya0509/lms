import React, { useState } from 'react';
import { Download } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
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
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const toast = useToast();

  const getDynamicData = (type: string, range: 'week' | 'month' | 'year') => {
    const isTimeAxis = type === 'enrollment' || type === 'certificate';
    
    let categories: string[];
    if (isTimeAxis) {
      categories = {
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }[range];
    } else {
      categories = {
        attendance: ['FSWD-Aug', 'MLP-Online', 'FSWD-Batch2', 'CEH-Batch', 'UIUX-Boot'],
        assessment: ['FSWD', 'MLP', 'UX', 'CEH'],
        trainer: ['Dr. Arun', 'Meena S.', 'Rajesh P.', 'Divya R.', 'Suresh N.'],
        course: ['FSWD', 'MLP', 'UX', 'CEH'],
      }[type] || [];
    }
    
    const baseValue = { enrollment: 120, attendance: 75, assessment: 65, trainer: 4.2, certificate: 45, course: 70 }[type as keyof typeof baseConfigs] || 50;
    const rangeMultiplier = type === 'trainer' || type === 'attendance' || type === 'assessment' || type === 'course' ? 1 : { week: 0.3, month: 1, year: 3 }[range];
    
    const data = categories.map((_, i) => {
       const variance = type === 'trainer' ? 0.6 : 25 * rangeMultiplier;
       const raw = (baseValue * rangeMultiplier) + (Math.sin(i * 1.5 + type.length) * variance);
       const max = type === 'trainer' ? 5 : (type === 'attendance' || type === 'assessment' || type === 'course' ? 100 : 5000);
       return Number(Math.min(max, Math.max(0, raw)).toFixed(type === 'trainer' ? 1 : 0));
    });
    
    return { categories, data };
  };

  const baseConfigs = {
    enrollment: { title: 'Enrollments Over Time', seriesName: 'Total Enrollments', color: '#DE896A' },
    attendance: { title: 'Average Batch Attendance %', seriesName: 'Attendance %', color: '#F4A261' },
    assessment: { title: 'Pass Rates by Course', seriesName: 'Pass %', color: '#E9C46A' },
    trainer: { title: 'Trainer Effectiveness Rating', seriesName: 'Avg Rating', color: '#F8C090' },
    certificate: { title: 'Certificates Issued Count', seriesName: 'Certificates', color: '#FBCBB0' },
    course: { title: 'Course Completion Rates', seriesName: 'Completion %', color: '#FFD8C2' },
  };

  const dynamic = getDynamicData(reportType, timeRange);
  const current = {
    title: baseConfigs[reportType].title,
    color: baseConfigs[reportType].color,
    categories: dynamic.categories,
    series: [{ name: baseConfigs[reportType].seriesName, data: dynamic.data }]
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Generate, analyze and export institutional telemetry and reports</p>
        </div>
        <Button icon={<Download size={15} />} onClick={() => toast.success(`Exporting ${reportType} report to CSV/PDF...`)}>Export Report</Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {(['enrollment', 'attendance', 'assessment', 'trainer', 'certificate', 'course'] as const).map(t => (
            <button key={t} onClick={() => setReportType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${reportType === t ? 'bg-primary-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]' : 'bg-white border border-slate-100 shadow-sm text-slate-500 hover:text-slate-900'}`}>
              {t} Report
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto flex-shrink-0">
          <div className="w-32 flex-shrink-0">
            <Select
              value={chartType}
              onChange={(val) => setChartType(val as typeof chartType)}
              options={[
                { value: 'bar', label: 'Bar Chart' },
                { value: 'line', label: 'Line Chart' },
                { value: 'area', label: 'Area Chart' },
              ]}
            />
          </div>
          <div className="w-40 flex-shrink-0">
            <Select
              value={timeRange}
              onChange={(val) => setTimeRange(val as typeof timeRange)}
              options={[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'year', label: 'This Year' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">{current.title}</h2>
          <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
            {timeRange === 'week' ? 'Last 7 days' : timeRange === 'month' ? 'Last 30 days' : 'Last 12 months'}
          </span>
        </div>
        <ReactApexChart
          key={`${reportType}-${chartType}-${timeRange}`}
          type={chartType}
          height={320}
          series={current.series}
          options={{
            ...chartBase,
            colors: [current.color],
            stroke: { curve: 'smooth', width: chartType === 'bar' ? 0 : 3 },
            fill: chartType === 'area' ? { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100] } } : {},
            plotOptions: { bar: { borderRadius: 8, columnWidth: '45%' } },
            xaxis: { categories: current.categories, labels: { style: { colors: '#64748b', fontSize: '12px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
            yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' } }, min: 0 },
          }}
        />
      </div>
    </div>
  );
};

export default ReportsPage;
