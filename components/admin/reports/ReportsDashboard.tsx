"use client";

import { useState } from "react";
import { Download, FileText, Calendar, Filter, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

export function ReportsDashboard() {
  const [dateRange, setDateRange] = useState("last30");
  const [isExporting, setIsExporting] = useState(false);

  const reports = [
    {
      id: "sales",
      title: "Sales Report",
      description: "Detailed breakdown of sales, taxes, and discounts.",
      type: "CSV",
    },
    {
      id: "inventory",
      title: "Inventory Valuation",
      description: "Current stock levels and total inventory value.",
      type: "CSV",
    },
    {
      id: "customers",
      title: "Customer List",
      description: "Export all customer data including lifetime value.",
      type: "CSV",
    },
    {
      id: "orders",
      title: "Order History",
      description: "All orders within the selected date range.",
      type: "CSV",
    },
  ];

  async function handleExport(reportId: string) {
    setIsExporting(true);
    toast.info(`Generating ${reportId} report...`);
    
    // Simulate generation time
    setTimeout(() => {
      setIsExporting(false);
      toast.success(`${reportId} report generated successfully! (Demo)`);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400 text-sm mt-0.5">Export data and generate detailed reports</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none">
              <label className="text-xs font-medium text-slate-400 block mb-1">Date Range</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full md:w-64 bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7">Last 7 Days</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="yearToDate">Year to Date</option>
                  <option value="allTime">All Time</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 md:flex-none">
              <label className="text-xs font-medium text-slate-400 block mb-1">Status</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select className="w-full md:w-48 bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none">
                  <option value="all">All Orders</option>
                  <option value="paid">Paid Only</option>
                  <option value="fulfilled">Fulfilled Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="border border-slate-800 rounded-xl p-5 bg-slate-900/50 hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{report.title}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{report.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleExport(report.id)}
                disabled={isExporting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-blue-600 group-hover:text-white text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
