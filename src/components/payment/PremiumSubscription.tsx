"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ActivePremiumCard } from "./PremiumSubscription/ActivePremiumCard";
import { UpgradeCard } from "./PremiumSubscription/UpgradeCard";

interface PremiumSubscriptionProps {
  showUpgradeButton?: boolean;
}

export function PremiumSubscription({
  showUpgradeButton = true,
}: PremiumSubscriptionProps) {
  const { user } = useAuth();
  const router = useRouter();

  const isPremium = user?.is_premium || false;

  const handleUpgrade = () => {
    router.push(
      "/payment/checkout?amount=99.99&description=Abonnement Premium In Extremis Formation"
    );
  };

  const handleManage = () => {
    router.push("/profile#payments");
  };

  if (isPremium) {
    return <ActivePremiumCard onManage={handleManage} />;
  }

  return (
    <UpgradeCard
      onUpgrade={handleUpgrade}
      showUpgradeButton={showUpgradeButton}
    />
  );
}
