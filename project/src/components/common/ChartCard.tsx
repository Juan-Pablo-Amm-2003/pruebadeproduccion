import React, { useState } from "react";

type ChartCardProps = {
  id?: string;                    // opcional: para capturas PDF
  title: string;
  height?: number | string;       // alto del contenedor del chart en la tarjeta
  children: React.ReactNode;      // chart “compacto” (sin borde/título propio)
  modal: React.ReactNode;         // chart para modal (normalmente height="100%")
};

export default function ChartCard({
  id,
  title,
  height = 320,
  children,
  modal,
}: ChartCardProps) {
  const [open, setOpen] = useState(false);

  // remonta el chart dentro del modal (evita tamaños 0 de Recharts)
  const modalContent = React.isValidElement(modal)
    ? React.cloneElement(modal, { key: "modal" })
    : modal;

  const cardHeight =
    typeof height === "number" ? `${Math.min(700, Math.max(220, height))}px` : height;

  return (
    <>
      <div
        id={id}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 cursor-pointer hover:shadow-md transition"
        onClick={() => setOpen(true)}
      >
        <h3 className="text-base sm:text-lg font-semibold text-center text-gray-800">
          {title}
        </h3>
        <div className="mt-3" style={{ height: cardHeight }}>
          {children}
        </div>
        <p className="text-[11px] text-gray-500 text-center mt-2">Click para ampliar</p>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-[92%] md:w-[82%] lg:w-[72%] h-[86%] p-6 flex flex-col relative">
            <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-3">
              {title} — Vista ampliada
            </h2>
            <div className="flex-1 min-h-0">
              {/* el chart del modal debe ocupar el 100% del alto disponible */}
              {modalContent}
            </div>
            <button
              aria-label="Cerrar"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white grid place-items-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
