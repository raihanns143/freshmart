import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Package, MapPin, FileText, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function CustomerDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Double check role if necessary, though this is primarily just for logged in users
  if ((session.user as any).role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  // Fetch user's recent orders
  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      items: {
        take: 3,
        include: { product: { select: { images: true } } }
      }
    }
  });

  return (
    <div className="section-container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                {session.user.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{session.user.name}</h3>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link href="/dashboard/customer" className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-semibold transition-colors">
                <Package className="w-5 h-5" />
                Orders
              </Link>
              <Link href="/dashboard/customer/addresses" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                <MapPin className="w-5 h-5" />
                Addresses
              </Link>
              <Link href="/dashboard/customer/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
                <Settings className="w-5 h-5" />
                Account Settings
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-800 text-gray-900 tracking-tight">Recent Orders</h1>
              <Link href="/dashboard/customer/orders" className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
                View All
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No orders yet</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't made a purchase yet.</p>
                <Link href="/shop" className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-colors inline-block">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-6 transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Order <span className="font-bold text-gray-900">#{order.orderNumber}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          Placed on {format(new Date(order.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                          {order.status}
                        </div>
                        <span className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {order.items.map((item, i) => (
                          <div key={item.id} className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 p-1 relative">
                            {item.product.images[0] && (
                              <img src={item.product.images[0].url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            )}
                            {i === 2 && order.items.length > 3 && (
                              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-200 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
                          Invoice
                        </button>
                        <Link href={`/dashboard/customer/orders/${order.id}`} className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary px-4 py-2 bg-primary/5 rounded-lg transition-colors">
                          Details
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
