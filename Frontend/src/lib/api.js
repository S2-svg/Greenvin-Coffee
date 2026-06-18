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

const request = async (path, options = {}) => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result.data;
};

export const createOrder = (order) =>
  request("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });

export const verifyOrderPayment = (orderId) => 
  request(`/orders/${orderId}/verify`);

export const getMenu = () => request("/menu");

export const getFeaturedItems = () => request("/menu/featured");

export const getOrders = () => request("/orders");

export const updateOrderStatus = (orderId, status) =>
  request(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
