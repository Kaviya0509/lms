import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, GraduationCap, Monitor, Globe, Calendar,
  Award, ClipboardList, CheckSquare, TrendingUp, Clock, AlertTriangle, ArrowRight,
} from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Select from '../../components/common/Select';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { mockDashboardStats, mockEnrollments, mockBatches } from '../../services/mockData';
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers';

const chartBase = {
  chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Inter, sans-serif' },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4, xaxis: { lines: { show: false } } },
  tooltip: { theme: 'light' as const },
  dataLabels: { enabled: false },
};

type EnrollmentRange = 'week' | 'month' | 'year';

const enrollmentTrendData: Record<EnrollmentRange, { categories: string[]; online: number[]; offline: number[] }> = {
  week: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    online: [12, 18, 15, 22, 19, 9, 6],
    offline: [5, 7, 6, 9, 8, 4, 2],
  },
  month: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    online: [42, 65, 78, 90, 115, 132, 148, 156],
    offline: [18, 22, 31, 38, 45, 52, 58, 67],
  },
  year: {
    categories: ['2021', '2022', '2023', '2024', '2025', '2026'],
    online: [320, 480, 610, 780, 950, 1120],
    offline: [140, 190, 240, 300, 360, 410],
  },
};

const DashboardPage: React.FC = () => {
  const s = mockDashboardStats;
  const navigate = useNavigate();
  const user = useAppSelector(st => st.auth.user);
  const trainees = useAppSelector(st => st.trainees.items);
  const firstName = (user?.name ?? 'Admin').split(' ')[0];
  const [enrollmentRange, setEnrollmentRange] = React.useState<EnrollmentRange>('month');

  const greeting = (() => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const trend = enrollmentTrendData[enrollmentRange];
  const enrollmentChart = {
    series: [
      { name: 'Online Enrollments', data: trend.online },
      { name: 'Offline Enrollments', data: trend.offline },
    ],
    options: {
      ...chartBase,
      colors: ['#DE896A', '#F4A261'],
      stroke: { curve: 'smooth' as const, width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.2, opacityTo: 0, stops: [0, 100] } },
      xaxis: { categories: trend.categories, labels: { style: { colors: '#64748b', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { colors: '#64748b', fontSize: '11px' } } },
      legend: { labels: { colors: '#64748b' }, fontSize: '12px' },
    },
  };

  const attendanceBreakdown = [
    { label: 'Present', value: 76, color: '#DE896A' },
    { label: 'Absent', value: 18, color: '#F4A261' },
    { label: 'Late', value: 6, color: '#FFD8C2' },
  ];
  const attendanceChart = {
    series: attendanceBreakdown.map(a => a.value),
    options: {
      ...chartBase,
      chart: { ...chartBase.chart, type: 'donut' as const },
      colors: attendanceBreakdown.map(a => a.color),
      labels: attendanceBreakdown.map(a => a.label),
      legend: { show: false },
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      plotOptions: { pie: { donut: { size: '72%', labels: { show: true, total: { show: true, label: 'Avg.', color: '#64748b', formatter: () => '76%' }, value: { color: '#0f172a', fontSize: '22px', fontWeight: '700' } } } } },
    },
  };

  const assessmentChart = {
    series: [{ name: 'Trainees', data: [12, 28, 84, 143] }],
    options: {
      ...chartBase,
      colors: ['#DE896A'],
      plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
      xaxis: { categories: ['0–40%', '40–60%', '60–80%', '80–100%'], labels: { style: { colors: '#64748b', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { colors: '#64748b', fontSize: '11px' } } },
    },
  };

  const certChart = {
    series: [{ name: 'Certificates Issued', data: [48, 72, 95, 110, 143, 167, 198, 224] }],
    options: {
      ...chartBase,
      colors: ['#F4A261'],
      stroke: { curve: 'smooth' as const, width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0, stops: [0, 100] } },
      xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], labels: { style: { colors: '#64748b', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
      yaxis: { labels: { style: { colors: '#64748b', fontSize: '11px' } } },
    },
  };

  const stats = [
    { title: 'Total Trainers', value: s.totalTrainers, icon: <Users size={19} className="text-primary-600" />, iconBg: 'bg-primary-50', growth: 8.3, delay: 0 },
    { title: 'Total Trainees', value: s.totalTrainees.toLocaleString(), icon: <GraduationCap size={19} className="text-emerald-600" />, iconBg: 'bg-emerald-50', growth: 14.2, delay: 0.05 },
    { title: 'Total Courses', value: s.totalCourses, icon: <BookOpen size={19} className="text-amber-600" />, iconBg: 'bg-amber-50', growth: 5.1, delay: 0.1 },
    { title: 'Online Courses', value: s.onlineCourses, icon: <Monitor size={19} className="text-cyan-600" />, iconBg: 'bg-cyan-50', delay: 0.15 },
    { title: 'Offline Courses', value: s.offlineCourses, icon: <Globe size={19} className="text-violet-600" />, iconBg: 'bg-violet-50', delay: 0.2 },
    { title: 'Active Batches', value: s.activeBatches, icon: <Calendar size={19} className="text-pink-600" />, iconBg: 'bg-pink-50', delay: 0.25 },
    { title: 'Completed Courses', value: s.completedCourses, icon: <CheckSquare size={19} className="text-teal-600" />, iconBg: 'bg-teal-50', delay: 0.3 },
    { title: 'Upcoming Sessions', value: s.upcomingSessions, icon: <Clock size={19} className="text-orange-600" />, iconBg: 'bg-orange-50', delay: 0.35 },
    { title: 'Pending Assessments', value: s.pendingAssessments, icon: <AlertTriangle size={19} className="text-red-600" />, iconBg: 'bg-red-50', delay: 0.4 },
    { title: 'Certificates Issued', value: s.certificatesIssued.toLocaleString(), icon: <Award size={19} className="text-yellow-600" />, iconBg: 'bg-yellow-50', growth: 22.7, delay: 0.45 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl px-5 sm:px-7 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 rounded-full bg-primary-500 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Dashboard</p>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
              {greeting}, {firstName}! <span>👋</span>
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Here's what's happening across your LMS today.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-2 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <TrendingUp size={13} className="text-emerald-500" />
          Live overview
        </div>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map(s => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-sm rounded-2xl p-5 flex items-center justify-between gap-4 overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-amber-100/60 pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md shadow-amber-200">
              <ClipboardList size={22} />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-amber-700">{s.pendingEnrollments}</p>
              <p className="text-sm text-slate-600 font-medium mt-0.5">Pending Approvals</p>
            </div>
          </div>
          <button onClick={() => navigate('/enrollments')}
            className="relative z-10 flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-xl transition-colors flex-shrink-0 cursor-pointer">
            Review <ArrowRight size={12} />
          </button>
        </div>
        <div className="relative bg-gradient-to-br from-primary-50 to-violet-50 border border-primary-200 shadow-sm rounded-2xl p-5 flex items-center justify-between gap-4 overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-primary-100/60 pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-primary-600 text-white rounded-2xl shadow-md shadow-primary-200">
              <GraduationCap size={22} />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-primary-700">{s.activeEnrollments.toLocaleString()}</p>
              <p className="text-sm text-slate-600 font-medium mt-0.5">Active Enrollments</p>
            </div>
          </div>
          <button onClick={() => navigate('/enrollments')}
            className="relative z-10 flex items-center gap-1.5 text-xs font-bold text-primary-700 bg-primary-100 hover:bg-primary-200 border border-primary-300 px-3 py-1.5 rounded-xl transition-colors flex-shrink-0 cursor-pointer">
            Details <ArrowRight size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">Enrollment Trends</p>
            <Select
              value={enrollmentRange}
              onChange={(v) => setEnrollmentRange(v as EnrollmentRange)}
              options={[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'year', label: 'This Year' },
              ]}
            />
          </div>
          <ReactApexChart type="area" height={220} series={enrollmentChart.series} options={enrollmentChart.options} />
        </div>
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col">
          <p className="text-sm font-semibold text-slate-700 mb-2">Attendance Overview</p>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <ReactApexChart type="donut" height={190} series={attendanceChart.series} options={attendanceChart.options} />
            </div>
            <div className="flex flex-col gap-2.5 flex-shrink-0 pr-1">
              {attendanceBreakdown.map(a => (
                <div key={a.label} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
                  <span className="text-slate-500 w-12">{a.label}</span>
                  <span className="font-semibold text-slate-900">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/attendance')}
            className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors mt-3 self-end cursor-pointer">
            View full report <ArrowRight size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Assessment Score Distribution</p>
          <ReactApexChart type="bar" height={200} series={assessmentChart.series} options={assessmentChart.options} />
        </div>
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Certificate Issuance Trend</p>
          <ReactApexChart type="area" height={200} series={certChart.series} options={certChart.options} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-800">Recent Enrollment Requests</p>
            <button onClick={() => navigate('/enrollments')} className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {mockEnrollments.slice(0, 4).map(e => {
              const trainee = trainees.find(t => t.id === e.traineeId);
              return (
                <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  {trainee?.avatar ? (
                    <img src={trainee.avatar} alt={e.traineeName} className="w-9 h-9 rounded-xl object-cover flex-shrink-0 border border-slate-100 shadow-sm" />
                  ) : (
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor(e.traineeName)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                      {getInitials(e.traineeName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{e.traineeName}</p>
                    <p className="text-xs text-slate-400 truncate">{e.courseName}</p>
                  </div>
                  <StatusBadge status={e.status} dot />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-800">Upcoming Batch Sessions</p>
            <button onClick={() => navigate('/batches')} className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {(() => {
              const upcoming = mockBatches
                .filter(b => b.sessions.length > 0)
                .flatMap(b => b.sessions.slice(0, 2).map(s => ({ ...s, batchName: b.name, trainerName: b.trainerName })))
                .slice(0, 4);
              if (upcoming.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                      <Calendar size={16} className="text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">No upcoming sessions scheduled.</p>
                  </div>
                );
              }
              return upcoming.map(session => (
                <div key={session.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="w-9 h-9 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{session.topic}</p>
                    <p className="text-xs text-slate-400">{session.batchName} · {session.startTime}–{session.endTime}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">{formatDate(session.date)}</span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
