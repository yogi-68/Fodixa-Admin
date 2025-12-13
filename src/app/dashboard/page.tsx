'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import {
  BuildingStorefrontIcon,
  TruckIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalRestaurants: number;
  activeRestaurants: number;
  pendingRestaurants: number;
  totalRiders: number;
  activeRiders: number;
  pendingRiders: number;
  todayOrders: number;
  todayRevenue: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRestaurants: 0,
    activeRestaurants: 0,
    pendingRestaurants: 0,
    totalRiders: 0,
    activeRiders: 0,
    pendingRiders: 0,
    todayOrders: 0,
    todayRevenue: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats({
        totalRestaurants: response.data.totalRestaurants || 0,
        activeRestaurants: response.data.activeRestaurants || 0,
        pendingRestaurants: response.data.pendingRestaurants || 0,
        totalRiders: response.data.totalRiders || 0,
        activeRiders: response.data.activeRiders || 0,
        pendingRiders: response.data.pendingRiders || 0,
        todayOrders: response.data.todayOrders || 0,
        todayRevenue: Number(response.data.todayRevenue || 0),
        totalOrders: response.data.totalOrders || 0,
        totalRevenue: Number(response.data.totalRevenue || 0),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Restaurants',
      value: stats.totalRestaurants,
      subtitle: `${stats.activeRestaurants} active · ${stats.pendingRestaurants} pending`,
      icon: BuildingStorefrontIcon,
      color: 'blue',
    },
    {
      title: 'Total Riders',
      value: stats.totalRiders,
      subtitle: `${stats.activeRiders} active · ${stats.pendingRiders} pending`,
      icon: TruckIcon,
      color: 'green',
    },
    {
      title: 'Today Orders',
      value: stats.todayOrders,
      subtitle: `${stats.totalOrders} total orders`,
      icon: ShoppingBagIcon,
      color: 'orange',
    },
    {
      title: 'Today Revenue',
      value: `$${stats.todayRevenue.toFixed(2)}`,
      subtitle: `$${stats.totalRevenue.toFixed(2)} total`,
      icon: CurrencyDollarIcon,
      color: 'purple',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with Fodixa today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card) => {
          const colors = colorClasses[card.color];
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg ${colors.icon}`}>
                  <card.icon className={`h-6 w-6 ${colors.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Approvals</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">New Restaurant Applications</p>
                <p className="text-sm text-gray-600">{stats.pendingRestaurants} pending review</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                Review
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Rider Verifications</p>
                <p className="text-sm text-gray-600">{stats.pendingRiders} pending verification</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                Review
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all text-left">
              <BuildingStorefrontIcon className="h-6 w-6 text-red-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">Add Restaurant</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all text-left">
              <TruckIcon className="h-6 w-6 text-red-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">Add Rider</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all text-left">
              <ShoppingBagIcon className="h-6 w-6 text-red-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">View Orders</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all text-left">
              <CurrencyDollarIcon className="h-6 w-6 text-red-600 mb-2" />
              <p className="font-medium text-gray-900 text-sm">Payouts</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
