const BASE_URL = "http://localhost:5000";
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: localStorage.getItem("token"),
});

export async function fetchDevices() {
  const res = await fetch(`${BASE_URL}/devices`, { headers: getHeaders() });
  return res.json();
}

export async function addDevice(name, watt) {
  const res = await fetch(`${BASE_URL}/add-device`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, watt })
  });
  return res.json();
}

export async function toggleDevice(id) {
  const res = await fetch(`${BASE_URL}/toggle/${id}`, {
    method: "POST",
    headers: getHeaders()
  });
  return res.json();
}
