'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  cuisine: string[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  totalOrders: number;
  revenue: number;
  createdAt: string;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRestaurants();
  }, [filter]);

  const loadRestaurants = async () => {
    try {
      // Mock data
      const mockData: Restaurant[] = [
        {
          id: '1',
          name: 'Pizza Paradise',
          email: 'contact@pizzaparadise.com',
          phone: '+1234567890',
          address: '123 Main St, City',
          cuisine: ['Italian', 'Pizza'],
          status: 'approved',
          rating: 4.8,
          totalOrders: 1250,
          revenue: 45600.50,
          createdAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          name: 'Sushi Master',
          email: 'info@sushimaster.com',
          phone: '+1234567891',
          address: '456 Oak Ave, City',
          cuisine: ['Japanese', 'Sushi'],
          status: 'pending',
          rating: 0,
          totalOrders: 0,
          revenue: 0,
          createdAt: '2024-03-10T14:30:00Z',
        },
        {
          id: '3',
          name: 'Burger Hub',
          email: 'hello@burgerhub.com',
          phone: '+1234567892',
          address: '789 Elm St, City',
          cuisine: ['American', 'Burgers'],
          status: 'approved',
          rating: 4.5,
          totalOrders: 890,
          revenue: 32400.75,
          createdAt: '2024-02-20T09:15:00Z',
        },
      ];

      const filtered = filter === 'all' 
        ? mockData 
        : mockData.filter(r => r.status === filter);

      setRestaurants(filtered);
    } catch (error) {
      // Error loading restaurants
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approveRestaurant(id);
      loadRestaurants();
    } catch (error) {
      // Error approving restaurant
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await adminAPI.rejectRestaurant(id, reason);
      loadRestaurants();
    } catch (error) {
      // Error rejecting restaurant
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Restaurant Management</h1>
        <p className="text-gray-600 mt-1">Manage and approve restaurant partners</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600">Approved</p>
          <p className="text-2xl font-bold text-green-900">
            {restaurants.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">
            {restaurants.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-900">
            {restaurants.filter(r => r.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Restaurant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuisine
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRestaurants.map((restaurant) => (
              <tr key={restaurant.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="font-medium text-gray-900">{restaurant.name}</p>
                    <p className="text-sm text-gray-500">{restaurant.address}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm text-gray-900">{restaurant.email}</p>
                    <p className="text-sm text-gray-500">{restaurant.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {restaurant.cuisine.map((c) => (
                      <span key={c} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(restaurant.status)}`}>
                    {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ⭐ {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {restaurant.totalOrders} orders · ${restaurant.revenue.toFixed(0)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    {restaurant.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(restaurant.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(restaurant.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
