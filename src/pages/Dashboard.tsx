import React from 'react';
import { Download, Plus, Users, BookOpen, Calendar, ArrowRight, MoreVertical } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import StatCard from '../components/ui/StatCard';
import { mockStats, enrollmentData } from '../data/mockData';

const chartOptions = {
  chart: { toolbar: { show: false }, background: 'transparent', sparkline: { enabled: false } },
  stroke: { curve: 'smooth' as const, width: 3 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.0, stops: [0, 100] } },
  colors: ['#A0522D'],
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { show: false },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 3 },
  tooltip: { theme: 'light' as const },
  dataLabels: { enabled: false },
  markers: { size: 4, colors: ['#fff'], strokeColors: '#A0522D', strokeWidth: 2, hover: { size: 6 } }
};

const donutOptions = {
  chart: { type: 'donut' as const, background: 'transparent' },
  labels: ['Online Delivery', 'Offline/Hybrid'],
  colors: ['#8e391d', '#c7d2fe'],
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          name: { show: false },
          value: { show: true, fontSize: '32px', fontWeight: 'bold', color: '#111827', formatter: () => '12' },
          total: { show: true, showAlways: true, label: 'Total Courses', fontSize: '12px', color: '#64748b' }
        }
      }
    }
  },
  dataLabels: { enabled: false },
  stroke: { show: false },
  legend: { show: false },
  tooltip: { theme: 'light' as const }
};

const Dashboard: React.FC = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Admin</h1>
        <p className="text-slate-500 text-sm max-w-xl">
          Here is an overview of TeqCertify's platform activity, enrollment metrics, and upcoming training sessions.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-semibold transition-colors">
          <Download size={16} /> Export Report
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-800 text-slate-900 hover:bg-primary-900 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={16} /> New Batch
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Trainers"
        value="45"
        growth={12}
        icon={<Users size={20} className="text-primary-600" />}
        iconBg="bg-primary-50 text-primary-600"
      />
      <StatCard
        title="Total Trainees"
        value="1,240"
        growth={8}
        icon={<Users size={20} className="text-emerald-600" />}
        iconBg="bg-emerald-50 text-emerald-600"
      />
      <StatCard
        title="Total Courses"
        value="12"
        icon={<BookOpen size={20} className="text-slate-600" />}
        iconBg="bg-slate-100 text-slate-600"
        subtitle="Active across 4 categories"
      />
      <StatCard
        title="Active Batches"
        value="18"
        growth={24}
        icon={<Calendar size={20} className="text-amber-600" />}
        iconBg="bg-amber-50 text-amber-600"
      />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Enrollment Trends</h2>
          <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
            Last 6 Months
          </div>
        </div>
        <ReactApexChart
          type="area"
          height={280}
          series={[{ name: 'Enrollments', data: [120, 200, 180, 310, 320, 400] }]}
          options={chartOptions}
        />
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Course Distribution</h2>
          <button className="text-slate-500 hover:text-slate-600"><MoreVertical size={18} /></button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <ReactApexChart
            type="donut"
            height={220}
            series={[720, 520]}
            options={donutOptions}
          />

          <div className="w-full mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-800"></div>
                <span className="text-slate-600">Online Delivery</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-900">60%</span>
                <span className="text-slate-500 w-16 text-right">720 learners</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-200"></div>
                <span className="text-slate-600">Offline/Hybrid</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-900">40%</span>
                <span className="text-slate-500 w-16 text-right">520 learners</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Upcoming Sessions</h3>
          <button className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="pb-3 px-2">COURSE & BATCH</th>
                <th className="pb-3 px-2">TRAINER</th>
                <th className="pb-3 px-2">DATE & TIME</th>
                <th className="pb-3 px-2 text-right">LOCATION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { title: 'Advanced...', batch: 'Batch 42-A', iconBg: 'bg-primary-50 text-primary-700', trainer: 'Sarah Chen', date: 'Oct 24, 2023', time: '09:00 AM - 12:00 PM', type: 'Virtual' },
                { title: 'Database...', batch: 'Batch 18-B', iconBg: 'bg-amber-50 text-amber-700', trainer: 'Marcus Johnson', date: 'Oct 25, 2023', time: '13:00 PM - 16:00 PM', type: 'Room 402' },
                { title: 'Cybersecurity', batch: 'Batch 99-C', iconBg: 'bg-emerald-50 text-emerald-700', trainer: 'Elena Lopez', date: 'Oct 26, 2023', time: '10:00 AM - 15:00 PM', type: 'Virtual' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${row.iconBg}`}>
                        {'<>'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{row.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${row.iconBg.split(' ')[1].replace('text', 'bg')}`}></div>
                          <p className="text-xs text-slate-500">{row.batch}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {row.trainer.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{row.trainer}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <p className="text-sm font-medium text-slate-900">{row.date}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{row.time}</p>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                      {row.type === 'Virtual' ? <BookOpen size={12}/> : <Calendar size={12}/>}
                      {row.type}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent hidden"></div>
        <div className="space-y-5">
          {[
            { msg: 'Batch 41-B successfully completed certification.', time: '2 hours ago', iconBg: 'bg-amber-50 text-amber-600' },
            { msg: '24 new trainees enrolled in Cloud Infrastructure.', time: '5 hours ago', iconBg: 'bg-primary-50 text-primary-600' },
            { msg: 'Marcus Johnson uploaded new materials for Database Architecture.', time: 'Yesterday', iconBg: 'bg-slate-100 text-slate-600' },
            { msg: 'System Alert: Moodle sync completed with 2 non-critical errors.', time: 'Yesterday', iconBg: 'bg-red-50 text-red-600' }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${item.iconBg}`}>
                <div className="w-4 h-4" />
              </div>
              <div className="flex-1 pb-1 border-b border-slate-50 last:border-0">
                <p className="text-sm font-semibold text-slate-900 leading-snug">{item.msg}</p>
                <p className="text-xs text-slate-500 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
