// src/utilidades/deviceId.js
export const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID(); // genera un ID único
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};
