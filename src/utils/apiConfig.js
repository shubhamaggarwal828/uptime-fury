// Global API Configuration with user-configurable backend servers
export const INITIAL_DEFAULT_SERVERS = [
  {
    id: "local",
    name: "Primary Daemon (Local / Default)",
    url: import.meta.env.VITE_API_URI_FOR_METRICS || "http://localhost:5012",
    location: "US East / Localhost",
    region: "Local Daemon",
    color: "cyan",
    isDefault: true
  },
  {
    id: "us-west",
    name: "North America Edge (Oregon)",
    url: "https://us-west.uptimefury.shubham-aggarwal.com",
    location: "US-West (Hillsboro, OR)",
    region: "Edge Probe",
    color: "emerald"
  },
  {
    id: "eu-central",
    name: "Europe Core (Frankfurt)",
    url: "https://eu-central.uptimefury.shubham-aggarwal.com",
    location: "EU-Central (Frankfurt, DE)",
    region: "Edge Probe",
    color: "purple"
  },
  {
    id: "ap-south",
    name: "Asia Pacific (Mumbai)",
    url: "https://ap-south.uptimefury.shubham-aggarwal.com",
    location: "AP-South (Mumbai, IN)",
    region: "Edge Probe",
    color: "amber"
  }
];

export const getStoredServers = () => {
  try {
    const raw = localStorage.getItem("sysops_probe_servers_v2");
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DEFAULT_SERVERS;
};

export const saveStoredServers = (servers) => {
  localStorage.setItem("sysops_probe_servers_v2", JSON.stringify(servers));
};

export const getAllServers = () => {
  const servers = getStoredServers();
  const customBackendUrl = localStorage.getItem("sysops_custom_backend_url");

  return servers.map(s => {
    if (s.id === "local" && customBackendUrl && customBackendUrl.trim()) {
      return { ...s, url: customBackendUrl.trim().replace(/\/+$/, "") };
    }
    return { ...s };
  });
};

export const getActiveServerId = () => {
  return localStorage.getItem("sysops_active_server_id") || "local";
};

export const setActiveServerId = (id) => {
  localStorage.setItem("sysops_active_server_id", id);
};

export const getActiveBackendUrl = () => {
  // If user explicitly provided a custom backend URL
  const customBackendUrl = localStorage.getItem("sysops_custom_backend_url");
  if (customBackendUrl && customBackendUrl.trim()) {
    return customBackendUrl.trim().replace(/\/+$/, "");
  }

  // Otherwise check if a remote server was selected
  const activeId = getActiveServerId();
  if (activeId !== "local") {
    const servers = getStoredServers();
    const match = servers.find(s => s.id === activeId);
    if (match && match.url) {
      return match.url.replace(/\/+$/, "");
    }
  }

  return (import.meta.env.VITE_API_URI_FOR_METRICS || "http://localhost:5012").replace(/\/+$/, "");
};

export const getEndpoint = (path) => {
  const baseUrl = getActiveBackendUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
