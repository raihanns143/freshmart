import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { 
  Users, ShoppingBag, DollarSign, Activity, 
  PackageSearch, Settings, LayoutDashboard 
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Strict role-based access route guarding
  if ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "MANAGER") {
    redirect("/dashboard/customer");
  }

  // Fetch some basic analytics data
  const [userCount, productCount, recentOrders, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } }
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" }
    })
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-bold">F</span>
            </div>
            <span className="font-bold text-lg tracking-tight">FreshMart Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 overflow-y-auto flex flex-col gap-2">
          <p className="px-4 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Overview</p>
          <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-2.5 bg-primary/20 text-white rounded-xl font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            Dashboard
          </Link>
          <Link href="/dashboard/admin/orders" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Orders
          </Link>
          <Link href="/dashboard/admin/products" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition-colors">
            <PackageSearch className="w-5 h-5" />
            Products
          </Link>
          <Link href="/dashboard/admin/users" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5" />
            Customers
          </Link>
          
          <p className="px-4 text-xs font-bold uppercase tracking-wider text-gray-500 mt-6 mb-2">System</p>
          <Link href="/dashboard/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold">
              {session.user.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{session.user.name}</p>
              <p className="text-xs text-primary font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        <header className="mb-8">
          <h1 className="text-3xl font-800 text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${(totalRevenue._sum.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,248</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">{userCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">{productCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <PackageSearch className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Charts & Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link href="/dashboard/admin/orders" className="text-sm font-semibold text-primary hover:text-secondary">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">#{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.user.name}</p>
                        <p className="text-gray-500 text-xs">{order.user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{format(new Date(order.createdAt), "MMM d, yyyy")}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-yellow-50 text-yellow-600 border border-yellow-100">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 text-right">${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">System Activity</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="p-6 flex-1 flex flex-col gap-6">
              {[
                { action: "Product Restock", target: "Organic Bananas", time: "2 hours ago", color: "bg-green-500" },
                { action: "New User Registration", target: "john.doe@example.com", time: "4 hours ago", color: "bg-blue-500" },
                { action: "Order Refunded", target: "#ORD-8924", time: "5 hours ago", color: "bg-red-500" },
                { action: "Category Updated", target: "Frozen Foods", time: "1 day ago", color: "bg-orange-500" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${activity.color} ring-4 ring-white shadow-sm z-10 mt-1`} />
                    {i !== 3 && <div className="absolute top-4 bottom-[-24px] w-0.5 bg-gray-100" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.target} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
