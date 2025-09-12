import React, { useEffect, useState } from "react";

type Props = {
  title: string;
  height?: number | string;      // alto del chart en la card
  children: React.ReactNode;     // Chart embebido
  modal: React.ReactNode;        // Chart en vista ampliada
};

export default function ChartCard({ title, height = 320, children, modal }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-md p-4 lg:p-5 flex flex-col gap-2 cursor-pointer hover:shadow-lg hover:scale-[1.015] transition-all"
        onClick={() => setOpen(true)}
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center">{title}</h3>
        <div style={{ height }}>{children}</div>
        <p className="text-[11px] text-gray-500 text-center">Click para ampliar</p>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-[92%] md:w-[80%] lg:w-[70%] h-[85%] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-3 text-center text-gray-700">{title} — Vista ampliada</h2>
            <div className="flex-grow min-h-0">{modal}</div>
            <button
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
