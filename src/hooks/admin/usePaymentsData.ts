// Hook pour les données de paiements

import { LIST_PAYMENTS_QUERY } from "@/graphql/queries/payment-queries";
import { USERS_QUERY } from "@/graphql/queries/user-queries";
import { QUERY_LIMITS } from "@/lib/admin/constants";
import {
  AdminPayment,
  AdminUser,
  PaymentFilterStatus,
} from "@/lib/admin/types";
import { useQuery } from "@apollo/client";
import { useMemo, useState } from "react";

export const usePaymentsData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<PaymentFilterStatus>("all");

  const { data: paymentsData, loading: paymentsLoading } =
    useQuery(LIST_PAYMENTS_QUERY);
  const { data: usersData } = useQuery(USERS_QUERY, {
    variables: { limit: QUERY_LIMITS.default, offset: QUERY_LIMITS.offset },
  });

  const payments: AdminPayment[] = useMemo(
    () => paymentsData?.list_payments || [],
    [paymentsData?.list_payments]
  );
  const users: AdminUser[] = useMemo(
    () => usersData?.users || [],
    [usersData?.users]
  );

  const usersMap = useMemo(
    () => new Map<string, AdminUser>(users.map((u) => [u.id, u])),
    [users]
  );

  const filteredPayments = payments.filter((p) => {
    const userInfo = usersMap.get(p.user_id);
    const matchesSearch =
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo?.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || p.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = useMemo(() => {
    const totalAmount = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const paidCount = payments.filter((p) => p.status === "paid").length;
    const pendingCount = payments.filter(
      (p) => p.status === "pending" || p.status === "open"
    ).length;

    return {
      totalPayments: payments.length,
      paidCount,
      pendingCount,
      totalAmount,
    };
  }, [payments]);

  return {
    payments,
    filteredPayments,
    usersMap,
    stats,
    loading: paymentsLoading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
  };
};
