import WhatsAppIcon from "./WhatsAppIcon.jsx";

export default function WhatsAppPreview({ message, title = "Message preview" }) {
  return (
    <div className="whatsapp-preview">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366]/15 text-[#1a8f47]">
          <WhatsAppIcon className="w-4 h-4" />
        </span>
        <div>
          <p className="text-[11px] tracking-widest2 uppercase text-ink/45">{title}</p>
          <p className="text-xs text-ink/70">Opens WhatsApp with this pre-filled enquiry</p>
        </div>
      </div>

      <div className="whatsapp-bubble">
        <p className="text-[13px] leading-relaxed text-ink/80 whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
}
