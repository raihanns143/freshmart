"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  DollarSign, ShoppingBag, Users, TrendingUp, Package, Clock
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-400 bg-amber-500/10",
  CONFIRMED: "text-blue-400 bg-blue-500/10",
  PROCESSING: "text-indigo-400 bg-indigo-500/10",
  SHIPPED: "text-purple-400 bg-purple-500/10",
  DELIVERED: "text-emerald-400 bg-emerald-500/10",
  CANCELLED: "text-red-400 bg-red-500/10",
};

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
  ordersLast7: number;
  ordersLast30: number;
}

interface AnalyticsDashboardProps {
  stats: Stats;
  revenueChartData: { date: string; revenue: number }[];
  topProducts: { id: string; name: string; revenue: number; quantity: number }[];
  ordersByStatus: Record<string, number>;
  recentOrders: any[];
}

export function AnalyticsDashboard({
  stats, revenueChartData, topProducts, ordersByStatus, recentOrders
}: AnalyticsDashboardProps) {

  const statusData = useMemo(() => {
    return Object.entries(ordersByStatus).map(([status, count]) => ({
      status, count,
    })).sort((a, b) => b.count - a.count);
  }, [ordersByStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 text-sm mt-0.5">Store performance and insights</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Total Customers", value: stats.totalCustomers, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Avg Order Value", value: `$${stats.avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-400">{kpi.label}</p>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-6">Revenue (Last 30 Days)</h2>
          <div className="h-72 w-full">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth()+1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "0.5rem" }}
                    labelStyle={{ color: "#94a3b8", marginBottom: "0.25rem" }}
                    itemStyle={{ color: "#34d399", fontWeight: 600 }}
                    formatter={(val: any) => [`$${Number(val).toFixed(2)}`, "Revenue"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#34d399" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: "#34d399", stroke: "#0f172a", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <DollarSign className="w-8 h-8 mb-2 opacity-40" />
                <p>No revenue data for the last 30 days</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-6 flex items-center justify-between">
            Top Products
            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded-md">By Revenue</span>
          </h2>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.quantity} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">${p.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-500">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No sales data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-6">Orders by Status</h2>
          <div className="h-64 w-full">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="status" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "0.5rem" }}
                    itemStyle={{ color: "#3b82f6" }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <Clock className="w-8 h-8 mb-2 opacity-40" />
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase">Order</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase">Total</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500 text-sm">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3 text-sm font-mono text-white">
                        <Link href={`/admin/orders/${order.id}`} className="hover:text-emerald-400">
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm text-white">{order.user.name || "—"}</p>
                        <p className="text-xs text-slate-500">{order.user.email}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-white">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "text-slate-400 bg-slate-500/10"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
