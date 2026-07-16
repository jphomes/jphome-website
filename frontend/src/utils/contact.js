export const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER || "9893911656";
export const PHONE_DISPLAY = import.meta.env.VITE_PHONE_DISPLAY || "+91 98939 11656";

export function callPhone() {
  window.location.href = `tel:+91${PHONE_NUMBER.replace(/\D/g, "")}`;
}
