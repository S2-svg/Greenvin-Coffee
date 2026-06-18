const configuredApiBaseUrl = import.meta.env.VITE_API_URL;
const getApiBaseUrl = () => {
  if (configuredApiBaseUrl) {
    const isBrowser = typeof window !== "undefined";
    const pageHost = isBrowser ? window.location.hostname : "";
    const isLocalhostApi = configuredApiBaseUrl.includes("://localhost:");
    const isLanPage = pageHost && pageHost !== "localhost" && pageHost !== "127.0.0.1";
    if (isLocalhostApi && isLanPage) {
      return configuredApiBaseUrl.replace("://localhost:", `://${pageHost}:`);
    }
    return configuredApiBaseUrl;
  }
  const host = typeof window === "undefined" ? "localhost" : window.location.hostname;
  return `http://${host}:8000/api`;
};

const apiBaseUrl = getApiBaseUrl();

const getToken = () => localStorage.getItem('admin_token');

const adminRequest = async (path, options = {}) => {
  const token = getToken();
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : '',
      ...options.headers,
    },
    ...options,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    throw new Error(result.message || result.data?.message || "Request failed");
  }

  return result;
};

export const adminLogin = (email, password) =>
  adminRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const adminMe = () =>
  adminRequest("/auth/me");

export const adminLogout = () =>
  adminRequest("/auth/logout", { method: "POST" });

export const getDashboard = () =>
  adminRequest("/admin/dashboard");

export const getMenuItems = () =>
  adminRequest("/admin/menu-items");

export const getMenuItem = (id) =>
  adminRequest(`/admin/menu-items/${id}`);

export const createMenuItem = (data) =>
  adminRequest("/admin/menu-items", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateMenuItem = (id, data) =>
  adminRequest(`/admin/menu-items/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteMenuItem = (id) =>
  adminRequest(`/admin/menu-items/${id}`, {
    method: "DELETE",
  });

export const getAdminOrders = (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.date_from) query.set('date_from', params.date_from);
  if (params.date_to) query.set('date_to', params.date_to);
  if (params.page) query.set('page', params.page);
  if (params.per_page) query.set('per_page', params.per_page);
  if (params.sort_by) query.set('sort_by', params.sort_by);
  if (params.sort_dir) query.set('sort_dir', params.sort_dir);
  const qs = query.toString();
  return adminRequest(`/admin/orders${qs ? `?${qs}` : ''}`);
};

export const getAdminOrder = (id) =>
  adminRequest(`/admin/orders/${id}`);

export const updateAdminOrderStatus = (id, status) =>
  adminRequest(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteAdminOrder = (id) =>
  adminRequest(`/admin/orders/${id}`, {
    method: "DELETE",
  });

export const getSettings = () =>
  adminRequest("/admin/settings");

export const updateSettings = (settings) =>
  adminRequest("/admin/settings", {
    method: "PUT",
    body: JSON.stringify({ settings }),
  });
