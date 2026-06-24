import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import "./PwaStatusBanner.css";

export function PwaStatusBanner() {
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!offlineReady) return;
    const timer = setTimeout(() => setOfflineReady(false), 4000);
    return () => clearTimeout(timer);
  }, [offlineReady, setOfflineReady]);

  if (needRefresh) {
    return (
      <div className="pwa-status-banner pwa-status-banner--update" role="status">
        <span>新しいバージョンがあります。</span>
        <button type="button" onClick={() => updateServiceWorker(true)}>
          更新する
        </button>
        <button type="button" onClick={() => setNeedRefresh(false)}>
          後で
        </button>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="pwa-status-banner pwa-status-banner--offline" role="status">
        オフラインです。表示中のデータは最新でない可能性があります。
      </div>
    );
  }

  if (offlineReady) {
    return (
      <div className="pwa-status-banner pwa-status-banner--ready" role="status">
        オフラインでも利用できるようになりました。
      </div>
    );
  }

  return null;
}
