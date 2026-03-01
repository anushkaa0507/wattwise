const BASE_URL = "http://localhost:5000";

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