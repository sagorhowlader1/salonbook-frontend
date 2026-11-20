
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  Search,
  Users,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Ban,
  CheckCircle,
  X,
  Mail,
  CalendarDays,
  Loader2,
  RefreshCw,
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  banned?: boolean;
  banReason?: string | null;
  banExpires?: Date | string | null;
  createdAt?: Date | string;
  emailVerified?: boolean;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch customers
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await authClient.admin.listUsers({
        query: {
          limit: 100,
          filterField: "role",
          filterValue: "customer",
          filterOperator: "eq",
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      setUsers(
        (result.data?.users ?? []) as unknown as Customer[]
      );
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Search customers
  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return users;

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value)
    );
  }, [users, search]);

  const blockedCount = users.filter(
    (user) => user.banned
  ).length;

  const activeCount = users.length - blockedCount;

  // Block customer
  const handleBlock = async (user: Customer) => {
  setProcessingId(user.id);

  try {
    const result = await authClient.admin.banUser({
      userId: user.id,
      banReason: "Blocked by administrator",
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id
          ? { ...item, banned: true, banReason: "Blocked by administrator" }
          : item
      )
    );

    setSelectedUser((previous) =>
      previous?.id === user.id
        ? { ...previous, banned: true, banReason: "Blocked by administrator" }
        : previous
    );

    toast.add({
      title: "Customer Blocked",
      description: `${user.name} has been blocked successfully.`,
    });
  } catch (error) {
    toast.add({
      title: "Block Failed",
      description:
        error instanceof Error ? error.message : "Failed to block customer.",
    });
  } finally {
    setProcessingId(null);
  }
};

  // Unblock customer
  const handleUnblock = async (user: Customer) => {
  setProcessingId(user.id);

  try {
    const result = await authClient.admin.unbanUser({
      userId: user.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id
          ? { ...item, banned: false, banReason: null, banExpires: null }
          : item
      )
    );

    setSelectedUser((previous) =>
      previous?.id === user.id
        ? { ...previous, banned: false, banReason: null, banExpires: null }
        : previous
    );

    toast.add({
      title: "Customer Unblocked",
      description: `${user.name} has been unblocked successfully.`,
    });
  } catch (error) {
    toast.add({
      title: "Unblock Failed",
      description:
        error instanceof Error ? error.message : "Failed to unblock customer.",
    });
  } finally {
    setProcessingId(null);
  }
};

  const formatDate = (date?: Date | string | null) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-4 text-gray-900 sm:p-6 lg:p-8 dark:bg-[#111210] dark:text-white">

      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage registered customers and control their platform access.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Customers"
          value={users.length}
          icon={<Users size={21} />}
          color="gold"
        />

        <StatCard
          title="Active Customers"
          value={activeCount}
          icon={<ShieldCheck size={21} />}
          color="green"
        />

        <StatCard
          title="Blocked Customers"
          value={blockedCount}
          icon={<ShieldAlert size={21} />}
          color="red"
        />
      </div>

      {/* Notifications */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
          {success}
          <button onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Customer Table */}
      
{/* Customer Table */}
<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#191a17]">

  {/* Header */}
  <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
    <div>
      <h2 className="font-semibold">Registered Customers</h2>
      <p className="mt-1 text-xs text-gray-500">
        View and manage customer accounts.
      </p>
    </div>

    <div className="relative w-full sm:max-w-xs">
      <Search
        size={17}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name or email..."
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#c6a45b] focus:ring-2 focus:ring-[#c6a45b]/20 dark:border-white/10 dark:bg-white/5"
      />
    </div>
  </div>

  {/* Loading */}
  {loading ? (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="mb-3 animate-spin text-[#c6a45b]" size={28} />
      <p className="text-sm text-gray-500">Loading customers...</p>
    </div>
  ) : filteredUsers.length === 0 ? (
    <div className="py-16 text-center text-sm text-gray-500">
      {search
        ? "No customers match your search."
        : "No registered customers found."}
    </div>
  ) : (
    <>
      {/* MOBILE CUSTOMER CARDS */}
      <div className="divide-y divide-gray-100 md:hidden dark:divide-white/10">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-4">

            {/* Customer Info */}
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c6a45b]/15 font-semibold text-[#b18b3c]">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {user.name}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {user.email}
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(user)}
                className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-[#c6a45b] hover:text-[#b18b3c] dark:border-white/10"
                title="View Details"
              >
                <Eye size={17} />
              </button>
            </div>

            {/* Status and Date */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mb-1 text-[11px] text-gray-400">
                  JOINED DATE
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {formatDate(user.createdAt)}
                </p>
              </div>

              <div>
                {user.banned ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    <ShieldAlert size={13} />
                    Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <ShieldCheck size={13} />
                    Active
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4">
              {user.banned ? (
                <button
                  onClick={() => handleUnblock(user)}
                  disabled={processingId === user.id}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {processingId === user.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <CheckCircle size={15} />
                  )}
                  Unblock Customer
                </button>
              ) : (
                <button
                  onClick={() => handleBlock(user)}
                  disabled={processingId === user.id}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {processingId === user.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Ban size={15} />
                  )}
                  Block Customer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-white/5">
            <tr>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Joined Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-white/10">
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="transition hover:bg-gray-50 dark:hover:bg-white/[0.03]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c6a45b]/15 font-semibold text-[#b18b3c]">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-500">
                  {formatDate(user.createdAt)}
                </td>

                <td className="px-5 py-4">
                  {user.banned ? (
                    <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      Blocked
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      Active
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      title="View Details"
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:text-[#b18b3c] dark:border-white/10"
                    >
                      <Eye size={16} />
                    </button>

                    {user.banned ? (
                      <button
                        onClick={() => handleUnblock(user)}
                        disabled={processingId === user.id}
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {processingId === user.id ? "Loading..." : "Unblock"}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(user)}
                        disabled={processingId === user.id}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {processingId === user.id ? "Loading..." : "Block"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}

  {/* Footer */}
  <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500 dark:border-white/10">
    Showing {filteredUsers.length} of {users.length} customers
  </div>
</div>


      {/* Customer Details Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-details-title"
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1b1c19]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="customer-details-title" className="text-lg font-bold">
                Customer Details
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mb-5 flex flex-col items-center text-center">
              {selectedUser.image ? (
                <img
                  src={selectedUser.image}
                  alt={selectedUser.name}
                  className="mb-3 h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#c6a45b]/15 text-2xl font-bold text-[#b18b3c]">
                  {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <h3 className="text-xl font-bold">{selectedUser.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                Customer Account
              </p>

              <span
                className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${
                  selectedUser.banned
                    ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    : "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                }`}
              >
                {selectedUser.banned ? "Blocked" : "Active"}
              </span>
            </div>

            <div className="space-y-4 rounded-xl bg-gray-50 p-4 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-[#b18b3c]" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="break-all text-sm font-medium">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays size={17} className="text-[#b18b3c]" />
                <div>
                  <p className="text-xs text-gray-500">Joined Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              </div>

              {selectedUser.banned && (
                <div className="flex items-start gap-3">
                  <ShieldAlert size={17} className="mt-0.5 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Block Reason</p>
                    <p className="text-sm font-medium">
                      {selectedUser.banReason || "No reason provided"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5">
              {selectedUser.banned ? (
                <button
                  onClick={() => handleUnblock(selectedUser)}
                  disabled={processingId === selectedUser.id}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle size={17} />
                  Unblock Customer
                </button>
              ) : (
                <button
                  onClick={() => handleBlock(selectedUser)}
                  disabled={processingId === selectedUser.id}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  <Ban size={17} />
                  Block Customer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Statistics Card
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "gold" | "green" | "red";
}) {
  const styles = {
    gold: "bg-[#c6a45b]/10 text-[#b18b3c]",
    green: "bg-green-500/10 text-green-600",
    red: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#191a17]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <div className={`rounded-lg p-2.5 ${styles[color]}`}>
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}











// "use client";


// import { useEffect, useState } from "react";
// import { authClient } from "@/lib/auth-client";

// export default function ManageUsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

  
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const result = await authClient.admin.listUsers({
//           query: {
//             limit: 100,
//             filterField: "role",
//             filterValue: "customer",
//             filterOperator: "eq",
//           },
//         });

//         if (result.data) {
//           setUsers(result.data.users);
//         }
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   if (loading) {
//     return <p>Loading users...</p>;
//   }

//   return (
//     <div>
//       <h1>Manage Users</h1>

//       {users.map((user) => (
//         <div key={user.id}>
//           <p>{user.name}</p>
//           <p>{user.email}</p>
//         </div>
//       ))}
//     </div>
//   );
// }