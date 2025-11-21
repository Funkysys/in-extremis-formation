import { InstallPrompt } from "./InstallPrompt";
import { OfflineBanner } from "./OfflineBanner";
import { UpdateNotification } from "./UpdateNotification";

export function PWAManager() {
  return (
    <>
      <InstallPrompt />
      <OfflineBanner />
      <UpdateNotification />
    </>
  );
}
