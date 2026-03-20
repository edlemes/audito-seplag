import { useEffect, useState } from "react";
import { MessageCircle, ArrowUp } from "lucide-react";

const WHATSAPP_NUMBER = "556596886670";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20audit%C3%B3rio.`;

const FloatingButtons = () => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handle = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Contato pelo WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        {/* Pulse ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" style={{ animationDuration: "2.5s" }} />
      </a>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-[88px] right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </>
  );
};

export default FloatingButtons;
