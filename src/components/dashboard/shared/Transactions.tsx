
"use client";

import { useEffect, useMemo, useState } from "react";

interface Transaction {
  _id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  appointmentDate: string;
  amount: number | null;
  currency: string;
  sessionId: string;
  paymentStatus: string;
  transactionDate: string | null;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/admin/transactions", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load transactions."
          );
        }

        setTransactions(result.data || []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const paidCount = transactions.filter(
    (item) => item.paymentStatus.toLowerCase() === "paid"
  ).length;

  const pendingCount = transactions.filter(
    (item) =>
      ["unpaid", "pending"].includes(
        item.paymentStatus.toLowerCase()
      )
  ).length;

  const failedCount = transactions.filter(
    (item) => item.paymentStatus.toLowerCase() === "failed"
  ).length;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch = [
        item.customerName,
        item.customerEmail,
        item.serviceName,
        item.sessionId,
      ].some((value) =>
        (value || "").toLowerCase().includes(searchValue)
      );

      const matchesStatus =
        statusFilter === "All" ||
        item.paymentStatus.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null) return "N/A";

    return amount.toFixed(2);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "unpaid":
      case "pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "failed":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-600";
    }
  };

  const shortenSessionId = (sessionId: string) => {
    if (!sessionId || sessionId === "N/A") return "N/A";

    return sessionId.length > 22
      ? `${sessionId.slice(0, 14)}...`
      : sessionId;
  };

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 my-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 sm:mx-6">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-4 py-5 sm:space-y-7 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Payment Management
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor customer payments and transaction history.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Payment Records
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {/* Total Transactions */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Transactions
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M7 9h10M7 13h6" />
              </svg>
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            {transactions.length}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            All recorded payment transactions
          </p>
        </div>

        {/* Successful Payments */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Successful Payments
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
                <path d="m5 12 4 4L19 6" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-emerald-700">
            {paidCount}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Payments verified successfully
          </p>
        </div>

        {/* Pending Payments */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Pending Payments
            </p>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-amber-600">
            {pendingCount}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Unpaid or pending transactions
          </p>
        </div>
      </div>

      {/* Transactions Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Section Header */}
        <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                All Transactions
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Complete overview of customer payment activity.
              </p>
            </div>

            <p className="text-xs font-medium text-gray-500">
              {filteredTransactions.length} of {transactions.length} records
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:px-6">

          <div className="relative w-full flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, service or session ID..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-48"
          >
            <option value="All">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M7 9h10M7 13h6" />
              </svg>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No transactions found
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Transaction Cards */}
            <div className="space-y-3 bg-gray-50/50 p-3 md:hidden">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-sm font-semibold text-gray-900">
                        {transaction.customerName}
                      </h3>

                      <p className="mt-1 break-all text-xs text-gray-500">
                        {transaction.customerEmail}
                      </p>
                    </div>

                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(transaction.paymentStatus)}`}>
                      {transaction.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="my-4 border-t border-gray-100" />

                  <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Service
                      </p>
                      <p className="mt-1 break-words text-xs font-semibold text-gray-800">
                        {transaction.serviceName}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Appointment
                      </p>
                      <p className="mt-1 text-xs font-semibold text-gray-800">
                        {transaction.appointmentDate}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Amount
                      </p>
                      <p className="mt-1 text-base font-bold text-gray-900">
                        {formatAmount(transaction.amount)}{" "}
                        <span className="text-xs font-medium text-gray-500">
                          {transaction.currency}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Transaction Date
                      </p>
                      <p className="mt-1 text-xs font-semibold text-gray-800">
                        {formatDate(transaction.transactionDate)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Stripe Session ID
                    </p>
                    <p
                      title={transaction.sessionId}
                      className="mt-1 break-all text-xs text-gray-600"
                    >
                      {shortenSessionId(transaction.sessionId)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop and Tablet Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1150px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      "Customer",
                      "Related Service",
                      "Appointment Date",
                      "Amount",
                      "Currency",
                      "Stripe Session ID",
                      "Payment Status",
                      "Transaction Date",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="transition-colors hover:bg-gray-50/80"
                    >
                      <td className="px-5 py-4">
                        <p className="whitespace-nowrap font-semibold text-gray-900">
                          {transaction.customerName}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {transaction.customerEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        {transaction.serviceName}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {transaction.appointmentDate}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                        {formatAmount(transaction.amount)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {transaction.currency}
                      </td>

                      <td
                        title={transaction.sessionId}
                        className="px-5 py-4 font-mono text-xs text-gray-500"
                      >
                        {shortenSessionId(transaction.sessionId)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${getStatusStyle(transaction.paymentStatus)}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {transaction.paymentStatus.toUpperCase()}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-600">
                        {formatDate(transaction.transactionDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-gray-500">
            Showing {filteredTransactions.length} transaction(s)
          </p>

          <p className="text-xs font-medium text-gray-500">
            Read-only payment records
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
