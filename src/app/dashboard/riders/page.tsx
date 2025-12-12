'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: 'bike' | 'scooter' | 'car';
  vehicleNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  kycStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  totalDeliveries: number;
  earnings: number;
  isOnline: boolean;
  createdAt: string;
}

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRiders();
  }, [filter]);

  const loadRiders = async () => {
    try {
      const mockData: Rider[] = [
        {
          id: '1',
          name: 'John Rider',
          email: 'john@rider.com',
          phone: '+1234567890',
          vehicleType: 'bike',
          vehicleNumber: 'ABC1234',
          status: 'approved',
          kycStatus: 'verified',
          rating: 4.9,
          totalDeliveries: 567,
          earnings: 8900.50,
          isOnline: true,
          createdAt: '2024-01-10T10:00:00Z',
        },
        {
          id: '2',
          name: 'Mike Driver',
          email: 'mike@driver.com',
          phone: '+1234567891',
          vehicleType: 'scooter',
          vehicleNumber: 'XYZ5678',
          status: 'pending',
          kycStatus: 'pending',
          rating: 0,
          totalDeliveries: 0,
          earnings: 0,
          isOnline: false,
          createdAt: '2024-03-15T14:30:00Z',
        },
        {
          id: '3',
          name: 'Sarah Wheeler',
          email: 'sarah@wheeler.com',
          phone: '+1234567892',
          vehicleType: 'car',
          vehicleNumber: 'CAR9012',
          status: 'approved',
          kycStatus: 'verified',
          rating: 4.7,
          totalDeliveries: 342,
          earnings: 5600.75,
          isOnline: true,
          createdAt: '2024-02-05T09:15:00Z',
        },
      ];

      const filtered = filter === 'all' 
        ? mockData 
        : mockData.filter(r => r.status === filter);

      setRiders(filtered);
    } catch (error) {
      // Error loading riders
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approveRider(id);
      loadRiders();
    } catch (error) {
      // Error approving rider
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await adminAPI.rejectRider(id, reason);
      loadRiders();
    } catch (error) {
      // Error rejecting rider
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

  const getKycBadge = (kycStatus: string) => {
    const styles = {
      verified: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return styles[kycStatus as keyof typeof styles] || styles.pending;
  };

  const getVehicleIcon = (type: string) => {
    const icons = {
      bike: '🏍️',
      scooter: '🛵',
      car: '🚗',
    };
    return icons[type as keyof typeof icons] || '🚗';
  };

  const filteredRiders = riders.filter(r =>
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
        <h1 className="text-3xl font-bold text-gray-900">Rider Management</h1>
        <p className="text-gray-600 mt-1">Manage and verify delivery partners</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search riders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

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
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{riders.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600">Online</p>
          <p className="text-2xl font-bold text-green-900">
            {riders.filter(r => r.isOnline).length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600">Approved</p>
          <p className="text-2xl font-bold text-blue-900">
            {riders.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">
            {riders.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-900">
            {riders.filter(r => r.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KYC
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
            {filteredRiders.map((rider) => (
              <tr key={rider.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <TruckIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900 flex items-center">
                        {rider.name}
                        {rider.isOnline && (
                          <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{rider.isOnline ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm text-gray-900">{rider.email}</p>
                    <p className="text-sm text-gray-500">{rider.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getVehicleIcon(rider.vehicleType)} {rider.vehicleType.charAt(0).toUpperCase() + rider.vehicleType.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500">{rider.vehicleNumber}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(rider.status)}`}>
                    {rider.status.charAt(0).toUpperCase() + rider.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getKycBadge(rider.kycStatus)}`}>
                    {rider.kycStatus.charAt(0).toUpperCase() + rider.kycStatus.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ⭐ {rider.rating > 0 ? rider.rating.toFixed(1) : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {rider.totalDeliveries} deliveries · ${rider.earnings.toFixed(0)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    {rider.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(rider.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(rider.id)}
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
