const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function fetchDevices(token) {
  const res = await fetch(`${BASE_URL}/devices`, {
    headers: getHeaders(token),
  });
  return res.json();
}

export async function addDevice(name, watt, token) {
  const res = await fetch(`${BASE_URL}/add-device`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify({ name, watt }),
  });
  return res.json();
}

export async function toggleDevice(id, token) {
  const res = await fetch(`${BASE_URL}/toggle/${id}`, {
    method: "POST",
    headers: getHeaders(token),
  });
  return res.json();
}