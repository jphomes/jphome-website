import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { openWhatsApp } from "../utils/whatsapp.js";

const variants = {
  primary:
    "bg-[#25D366] text-white hover:bg-[#1ebe5d] rounded-xl font-semibold",
  outline:
    "border border-[#25D366]/40 text-[#1a8f47] bg-white hover:bg-[#25D366]/5 rounded-xl font-semibold",
  leaf:
    "bg-leaf text-white hover:bg-forest rounded-xl font-semibold",
};

export default function WhatsAppButton({
  message,
  label = "Chat on WhatsApp",
  variant = "primary",
  className = "",
  showIcon = true,
  fullWidth = false,
}) {
  return (
    <button
      type="button"
      onClick={() => openWhatsApp(message)}
      className={[
        "inline-flex items-center justify-center gap-2 text-sm px-5 py-3 transition-all duration-200",
        variants[variant] || variants.primary,
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showIcon && <WhatsAppIcon className="w-[18px] h-[18px] shrink-0" />}
      {label}
    </button>
  );
}
