interface BrowserCapabilitiesProps {
  capabilities: {
    supportsNativeHLS: boolean;
    supportsMSE: boolean;
    supportsHLS: boolean;
  };
}

export function BrowserCapabilities({
  capabilities,
}: BrowserCapabilitiesProps) {
  return (
    <div className="p-4 mb-4 bg-gray-100 rounded-lg dark:bg-gray-700">
      <h3 className="mb-2 font-semibold">Capacités du navigateur</h3>
      <ul className="space-y-1 text-sm">
        <li>
          ✅ HLS natif:{" "}
          {capabilities.supportsNativeHLS ? "Oui (Safari)" : "Non"}
        </li>
        <li>
          ✅ Media Source Extensions: {capabilities.supportsMSE ? "Oui" : "Non"}
        </li>
        <li>✅ HLS supporté: {capabilities.supportsHLS ? "Oui" : "Non"}</li>
      </ul>
    </div>
  );
}
