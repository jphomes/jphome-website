import WhatsAppIcon from "./WhatsAppIcon.jsx";

export default function WhatsAppPreview() {
  return (
    <div className="whatsapp-preview">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366]/15 text-[#1a8f47]">
          <WhatsAppIcon className="w-4 h-4" />
        </span>
        <p className="text-sm font-semibold tracking-wide text-ink/80">MORE DETAILS - ABOUT THIS PROPERTY</p>
      </div>
    </div>
  );
}
