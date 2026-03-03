
const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

/**
 * Fetch all devices for logged-in user
 */
export async function fetchDevices(token) {
  const res = await fetch(`${BASE_URL}/devices`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

/**
 * Add new device
 */
export async function addDevice(name, watt, token) {
  const res = await fetch(`${BASE_URL}/devices`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ name, watt }),
  });
  if (!res.ok) throw new Error(`Add failed: ${res.status}`);
  return res.json();
}

/**
 * Toggle device ON/OFF
 */
export async function toggleDevice(id, token) {
  const res = await fetch(`${BASE_URL}/devices/${id}`, {
    method: "PATCH",
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error(`Toggle failed: ${res.status}`);
  return res.json();
}