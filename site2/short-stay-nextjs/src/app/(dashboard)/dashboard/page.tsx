'use client';

import React from 'react';
import { Home, FileText, Users, TrendingUp } from 'lucide-react';

const stats = [
  {
    title: 'Total Properties',
    value: '24',
    icon: Home,
    change: '+12%',
    changeType: 'positive',
  },
  {
    title: 'Appraisal Reports',
    value: '156',
    icon: FileText,
    change: '+8%',
    changeType: 'positive',
  },
  {
    title: 'Active Users',
    value: '2,340',
    icon: Users,
    change: '+23%',
    changeType: 'positive',
  },
  {
    title: 'Revenue',
    value: '$12,450',
    icon: TrendingUp,
    change: '+18%',
    changeType: 'positive',
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-dark">{stat.value}</h3>
              <p className="text-gray text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-dark mb-4">
            Recent Properties
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-3 bg-light rounded-lg"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-dark">Property {item}</h4>
                  <p className="text-sm text-gray">123 Main Street, Sydney</p>
                </div>
                <span className="text-sm text-gray">2 days ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-dark mb-4">
            Recent Reports
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-3 bg-light rounded-lg"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-dark">Appraisal Report #{item}</h4>
                  <p className="text-sm text-gray">Generated successfully</p>
                </div>
                <span className="text-sm text-gray">1 day ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
