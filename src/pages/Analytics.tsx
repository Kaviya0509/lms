import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';

const lightTheme = {
  chart: { toolbar: { show: false }, background: 'transparent' },
  theme: { mode: 'light' as const },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 3 },
  tooltip: { theme: 'light' as const },
  dataLabels: { enabled: false },
};

const Analytics: React.FC = () => {
  const categoryRevenue = {
    series: [38, 27, 18, 11, 6],
    options: {
      ...lightTheme,
      labels: ['Web Development', 'Data Science', 'Backend', 'Design', 'Cloud'],
      colors: ['#DE896A', '#F4A261', '#E9C46A', '#F8C090', '#FBCBB0'],
      legend: { position: 'bottom' as const, labels: { colors: '#64748b' }, fontSize: '12px' },
      plotOptions: { pie: { donut: { size: '65%' } } },
      title: { text: 'Revenue by Category', style: { color: '#0f172a', fontSize: '13px', fontWeight: '600' } },
    },
  };

  const userGrowth = {
    series: [
      { name: 'Students', data: [420, 510, 690, 780, 920, 1100, 1240, 1380, 1520, 1680, 1820, 1970] },
      { name: 'Instructors', data: [12, 15, 19, 22, 26, 30, 34, 38, 42, 47, 52, 57] },
    ],
    options: {
      ...lightTheme,
      colors: ['#DE896A', '#F4A261'],
      stroke: { curve: 'smooth' as const, width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0, stops: [0, 90] } },
      xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], labels: { style: { colors: '#64748b' } } },
      yaxis: { labels: { style: { colors: '#64748b' } } },
      legend: { labels: { colors: '#64748b' } },
      title: { text: 'User Growth (Monthly)', style: { color: '#0f172a', fontSize: '13px', fontWeight: '600' } },
    },
  };

  const revenueBar = {
    series: [{ name: 'Revenue (₹)', data: [182000, 210000, 198000, 234000, 259000, 284750] }],
    options: {
      ...lightTheme,
      colors: ['#DE896A'],
      plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
      xaxis: { categories: ['Mar','Apr','May','Jun','Jul','Aug'], labels: { style: { colors: '#64748b' } } },
      yaxis: { labels: { style: { colors: '#64748b' }, formatter: (v: number) => `₹${(v/1000).toFixed(0)}K` } },
      title: { text: 'Monthly Revenue', style: { color: '#0f172a', fontSize: '13px', fontWeight: '600' } },
    },
  };

  const topMetrics = [
    { label: 'Avg. Revenue per User', value: '₹2,218', icon: <DollarSign size={18} className="text-amber-400" />, bg: 'bg-amber-500/10' },
    { label: 'Course Completion Rate', value: '68.4%', icon: <BookOpen size={18} className="text-primary-400" />, bg: 'bg-primary-500/10' },
    { label: 'Monthly Active Users', value: '4,892', icon: <Users size={18} className="text-emerald-400" />, bg: 'bg-emerald-500/10' },
    { label: 'Revenue Growth (MoM)', value: '+8.7%', icon: <TrendingUp size={18} className="text-violet-400" />, bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {topMetrics.map(m => (
          <div key={m.label} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${m.bg} flex-shrink-0`}>{m.icon}</div>
            <div>
              <p className="text-lg font-bold text-slate-900">{m.value}</p>
              <p className="text-xs text-slate-500">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
          <ReactApexChart type="area" height={240} series={userGrowth.series} options={userGrowth.options} />
        </div>
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
          <ReactApexChart type="donut" height={240} series={categoryRevenue.series} options={categoryRevenue.options} />
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
        <ReactApexChart type="bar" height={220} series={revenueBar.series} options={revenueBar.options} />
      </div>
    </div>
  );
};

export default Analytics;
