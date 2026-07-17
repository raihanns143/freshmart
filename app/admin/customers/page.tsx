import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Search, UserCircle, ChevronLeft, ChevronRight, ShoppingBag, Star, Heart } from "lucide-react";

export const metadata: Metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  // Show all non-admin users — including BLOCKED ones
  const excludedRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"];
  const where: any = {
    role: { notIn: excludedRoles },
  };
  if (sp.search) {
    where.AND = [
      {
        OR: [
          { name: { contains: sp.search, mode: "insensitive" } },
          { email: { contains: sp.search, mode: "insensitive" } },
          { phone: { contains: sp.search, mode: "insensitive" } },
        ],
      },
    ];
  }
  if (sp.role) {
    where.role = sp.role;
  }

  const [customers, total, settingsObj] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
        accounts: { select: { provider: true } },
        orders: { select: { total: true } },
        _count: { select: { orders: true, reviews: true, wishlist: true } },
      },
    }),
    prisma.user.count({ where }),
    prisma.setting.findMany(),
  ]);

  const settings = settingsObj.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {} as any);
  const currency = settings.currency || "BDT";

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total} registered customers</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap gap-2">
          <form className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="search"
                defaultValue={sp.search}
                placeholder="Search by name, email or phone..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <select
              name="role"
              defaultValue={sp.role}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="BLOCKED">Blocked</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {["Customer", "Email", "Provider", "Role", "Spent", "Orders", "Joined", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    <UserCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className={`hover:bg-slate-800/50 transition-colors ${c.role === "BLOCKED" ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {c.image ? (
                          <Image src={c.image} alt={c.name || "User"} width={32} height={32} className="w-8 h-8 rounded-full object-cover flex-shrink-0" unoptimized />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-semibold text-sm flex-shrink-0">
                            {(c.name || c.email)[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-sm text-white block truncate">{c.name || "—"}</span>
                          {c.phone && <span className="text-xs text-slate-500">{c.phone}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400 max-w-[180px] truncate">{c.email}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {c.accounts.length > 0 ? (
                        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400">Google</span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Email</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        c.role === "BLOCKED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {c.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: currency,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }).format(c.orders.reduce((acc, o) => acc + o.total, 0)).replace("BDT", "৳").replace("₹", "৳")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-slate-300">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                        {c._count.orders}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/admin/customers?page=${page - 1}${sp.search ? `&search=${sp.search}` : ""}`}
                className={`p-2 rounded-lg text-sm transition-colors ${page <= 1 ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <span className="px-3 py-2 text-sm text-slate-300">{page} / {totalPages}</span>
              <Link
                href={`/admin/customers?page=${page + 1}${sp.search ? `&search=${sp.search}` : ""}`}
                className={`p-2 rounded-lg text-sm transition-colors ${page >= totalPages ? "opacity-40 pointer-events-none bg-slate-800" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
