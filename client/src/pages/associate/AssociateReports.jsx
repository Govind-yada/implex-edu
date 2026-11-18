import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, BarChart3, TrendingUp, Building2 } from 'lucide-react';
import Badge from '../../components/common/Badge.jsx';

export default function AssociateReports() {
  const participationData = [
    { name: 'Jan', students: 45, quizzes: 60 },
    { name: 'Feb', students: 78, quizzes: 110 },
    { name: 'Mar', students: 120, quizzes: 185 },
    { name: 'Apr', students: 165, quizzes: 240 },
    { name: 'May', students: 190, quizzes: 290 },
    { name: 'Jun', students: 230, quizzes: 360 },
  ];

  const tierDistribution = [
    { name: 'Schools', value: 45, color: '#2563EB' },
    { name: 'Colleges', value: 35, color: '#4F46E5' },
    { name: 'Universities', value: 20, color: '#D97706' },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Month,Enrolled Students,Quizzes Completed\n' +
      participationData.map((e) => `${e.name},${e.students},${e.quizzes}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'implex_participation_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Participation Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate performance, quiz completions, and institution tier metrics.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report (CSV)
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Participation Growth Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Quiz & Student Growth Trend</h3>
              <p className="text-xs text-slate-500">Monthly student participation vs quiz volume</p>
            </div>
            <Badge variant="blue">Active Season</Badge>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Bar dataKey="students" name="Students" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="quizzes" name="Quizzes Taken" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institution Distribution Pie Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Institutional Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution across educational tiers</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {tierDistribution.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-bold text-slate-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
