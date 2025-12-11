'use client';

export default function UsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage customers and their accounts</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">User Management</h3>
          <p className="text-gray-600">
            This page will display all customer accounts with options to view profiles, manage subscriptions, and handle support tickets.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <p>Coming soon: Ban/unban users, view order history, manage wallets</p>
          </div>
        </div>
      </div>
    </div>
  );
}
