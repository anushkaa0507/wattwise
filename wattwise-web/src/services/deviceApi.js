const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

/**
 * Fetch all devices for logged-in user
 */
export async function fetchDevices(userId, token) {
  const res = await fetch(`${BASE_URL}/devices/${userId}`, {
    headers: getHeaders(token),
  });
  return res.json();
}

/**
 * Add new device
 */
export async function addDevice(userId, name, watt, token) {
  const res = await fetch(`${BASE_URL}/devices`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ userId, name, watt }),
  });
  return res.json();
}

/**
 * Toggle device ON/OFF
 */
export async function toggleDevice(userId, id, token) {
  const res = await fetch(`${BASE_URL}/devices/${userId}/${id}`, {
    method: "PATCH",
    headers: getHeaders(token),
  });
  return res.json();
}