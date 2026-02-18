const BASE_URL = "http://localhost:5000";

export async function fetchDevices() {
  const res = await fetch(`${BASE_URL}/devices`);
  return res.json();
}

export async function addDevice(name, watt) {
  const res = await fetch(`${BASE_URL}/add-device`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, watt })
  });
  return res.json();
}

export async function toggleDevice(id) {
  const res = await fetch(`${BASE_URL}/toggle/${id}`, {
    method: "POST"
  });
  return res.json();
}
