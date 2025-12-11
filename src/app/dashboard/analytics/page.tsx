'use client';

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-1">View platform performance and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Analytics</h3>
          <p className="text-gray-600 text-sm">
            Track revenue trends, commission earnings, and financial reports with interactive charts
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📈</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Metrics</h3>
          <p className="text-gray-600 text-sm">
            Monitor user growth, restaurant onboarding, and rider acquisition rates
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance KPIs</h3>
          <p className="text-gray-600 text-sm">
            View key performance indicators including delivery times and customer satisfaction
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🗺️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Regional Insights</h3>
          <p className="text-gray-600 text-sm">
            Analyze performance by region, popular cuisines, and peak hours
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>Note:</strong> Analytics dashboards with Recharts charts will be connected to backend API for real-time data visualization.
      </div>
    </div>
  );
}
