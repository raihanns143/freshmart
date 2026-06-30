"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp, ShoppingCart, Users, Package, DollarSign,
  Clock, AlertTriangle, RefreshCw, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const salesData = [
  { month: "Jan", revenue: 4200, orders: 82 },
  { month: "Feb", revenue: 5800, orders: 105 },
  { month: "Mar", revenue: 4900, orders: 91 },
  { month: "Apr", revenue: 7200, orders: 134 },
  { month: "May", revenue: 6100, orders: 115 },
  { month: "Jun", revenue: 8900, orders: 167 },
  { month: "Jul", revenue: 11200, orders: 210 },
];

const categoryData = [
  { name: "Fresh Fruits", value: 35, color: "#10b981" },
  { name: "Vegetables", value: 28, color: "#3b82f6" },
  { name: "Dairy & Eggs", value: 20, color: "#f59e0b" },
  { name: "Meat", value: 10, color: "#ef4444" },
  { name: "Bakery", value: 7, color: "#8b5cf6" },
];

const recentOrders = [
  { id: "#ORD-0091", customer: "Sarah Johnson", amount: 45.50, status: "DELIVERED", date: "2026-06-30" },
  { id: "#ORD-0090", customer: "Mike Chen", amount: 28.99, status: "SHIPPED", date: "2026-06-29" },
  { id: "#ORD-0089", customer: "Emma Davis", amount: 67.20, status: "PENDING", date: "2026-06-29" },
  { id: "#ORD-0088", customer: "James Wilson", amount: 15.00, status: "CANCELLED", date: "2026-06-28" },
  { id: "#ORD-0087", customer: "Lisa Park", amount: 89.40, status: "PREPARING", date: "2026-06-28" },
];

const statusColors: Record<string, string> = {
  DELIVERED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  SHIPPED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PENDING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  PREPARING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const positive = change >= 0;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-slate-400">{title}</p>
    </div>
  );
}

export function AdminDashboard() {
  const [stats] = useState({
    revenue: "$18,420",
    orders: "342",
    customers: "1,284",
    products: "189",
    pending: "23",
    lowStock: "12",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={stats.revenue} change={12.5} icon={<DollarSign className="w-5 h-5 text-emerald-400" />} color="bg-emerald-500/10" />
        <StatCard title="Total Orders" value={stats.orders} change={8.1} icon={<ShoppingCart className="w-5 h-5 text-blue-400" />} color="bg-blue-500/10" />
        <StatCard title="Total Customers" value={stats.customers} change={5.3} icon={<Users className="w-5 h-5 text-violet-400" />} color="bg-violet-500/10" />
        <StatCard title="Total Products" value={stats.products} change={-2.1} icon={<Package className="w-5 h-5 text-amber-400" />} color="bg-amber-500/10" />
      </div>

      {/* Secondary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-2"><Clock className="w-4 h-4" /><span className="text-xs font-medium">Pending Orders</span></div>
          <p className="text-3xl font-bold text-white">{stats.pending}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2"><AlertTriangle className="w-4 h-4" /><span className="text-xs font-medium">Low Stock</span></div>
          <p className="text-3xl font-bold text-white">{stats.lowStock}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2"><TrendingUp className="w-4 h-4" /><span className="text-xs font-medium">This Month</span></div>
          <p className="text-3xl font-bold text-white">$8.9K</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2"><RefreshCw className="w-4 h-4" /><span className="text-xs font-medium">Refund Requests</span></div>
          <p className="text-3xl font-bold text-white">3</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Revenue & Orders – Last 7 Months</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={false} name="Revenue ($)" />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300">{d.name}</span>
                </div>
                <span className="text-slate-400">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">Recent Orders</h3>
          <a href="/admin/orders" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">View All →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {["Order ID", "Customer", "Amount", "Status", "Date"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-mono text-emerald-400">{order.id}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-300">{order.customer}</td>
                  <td className="px-5 py-3.5 text-sm text-white font-medium">${order.amount.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
