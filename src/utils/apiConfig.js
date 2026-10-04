// Global API Configuration with the active backend server
export const INITIAL_DEFAULT_SERVERS = [
  {
    id: "active-daemon",
    name: "Production Telemetry Engine",
    url: import.meta.env.VITE_API_URI_FOR_METRICS || "https://uptime-monitor-backend-latest.onrender.com",
    location: "Global Edge / Render Cloud",
    region: "Primary Node",
    color: "cyan",
    isDefault: true
  }
];

export const getStoredServers = () => {
  try {
    const raw = localStorage.getItem("sysops_probe_servers_v3");
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_DEFAULT_SERVERS;
};

export const saveStoredServers = (servers) => {
  localStorage.setItem("sysops_probe_servers_v3", JSON.stringify(servers));
};

export const getAllServers = () => {
  const servers = getStoredServers();
  const customBackendUrl = localStorage.getItem("sysops_custom_backend_url");

  return servers.map(s => {
    if ((s.id === "active-daemon" || s.id === "local") && customBackendUrl && customBackendUrl.trim()) {
      return { ...s, url: customBackendUrl.trim().replace(/\/+$/, "") };
    }
    return { ...s };
  });
};

export const getActiveServerId = () => {
  return localStorage.getItem("sysops_active_server_id") || "active-daemon";
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

  // Otherwise check if a server was selected
  const activeId = getActiveServerId();
  const servers = getAllServers();
  const match = servers.find(s => s.id === activeId) || servers[0];
  if (match && match.url) {
    return match.url.replace(/\/+$/, "");
  }

  return (import.meta.env.VITE_API_URI_FOR_METRICS || "https://uptime-monitor-backend-latest.onrender.com").replace(/\/+$/, "");
};

export const getEndpoint = (path) => {
  const baseUrl = getActiveBackendUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
