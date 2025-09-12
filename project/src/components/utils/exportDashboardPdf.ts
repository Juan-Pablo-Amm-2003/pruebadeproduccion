// src/utils/exportIpcPdf.ts
import { jsPDF } from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import html2canvas from "html2canvas";
import type { Task } from "../../types/task";

type Filtros = {
  progreso?: string;
  asignado_a?: string;
  completado_por?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
};

const A4 = { w: 210, h: 297 };
const MARGIN = 10;

async function captureToImg(id: string): Promise<{ img: string; w: number; h: number } | null> {
  const node = document.getElementById(id);
  if (!node) return null;
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#fff",
    useCORS: true,
    logging: false,
    windowWidth: node.scrollWidth,
    windowHeight: node.scrollHeight,
  });
  const img = canvas.toDataURL("image/png");
  const ratio = canvas.height / canvas.width;
  const w = A4.w - MARGIN * 2;
  const h = w * ratio;
  return { img, w, h };
}

function header(pdf: jsPDF, filtros: Filtros, titulo = "Indicador de Eficiencia de IPC") {
  pdf.setFontSize(16);
  pdf.text(`${titulo}`, MARGIN, 16);
  pdf.setFontSize(10);
  const parts = [
    filtros.progreso && `Estado: ${filtros.progreso}`,
    filtros.asignado_a && `Asignado a: ${filtros.asignado_a}`,
    filtros.completado_por && `Completado por: ${filtros.completado_por}`,
    filtros.fechaDesde && `Desde: ${new Date(filtros.fechaDesde).toLocaleDateString()}`,
    filtros.fechaHasta && `Hasta: ${new Date(filtros.fechaHasta).toLocaleDateString()}`,
    filtros.search && `Buscar: "${filtros.search}"`,
  ].filter(Boolean) as string[];
  pdf.text(parts.join("   ") || "Sin filtros aplicados", MARGIN, 22);
  pdf.text(`Fecha de generación: ${new Date().toLocaleString()}`, MARGIN, 28);
}

function paginate(pdf: jsPDF) {
  // jsPDF v2 trae getNumberOfPages tipado; si por cache no aparece, usamos fallback.
  const pages =
    (pdf as any).getNumberOfPages?.() ??
    (pdf as any).internal?.pages?.length ??
    1;

  pdf.setFontSize(9);
  for (let p = 1; p <= pages; p++) {
    pdf.setPage(p);
    pdf.text(`Página ${p} de ${pages}`, A4.w - MARGIN, A4.h - 6, { align: "right" });
  }
}

export async function exportIpcPdf(opts: {
  filtros: Filtros;
  fileName?: string;
  blockIds?: string[];
  tableRows?: Task[];
  titulo?: string;
}) {
  const { filtros, tableRows = [], fileName = "Reporte_IPC", blockIds = [], titulo } = opts;

  const pdf = new jsPDF("p", "mm", "a4");
  let y = MARGIN;

  header(pdf, filtros, titulo);
  y = 34;

  for (const id of blockIds) {
    const snap = await captureToImg(id);
    if (!snap) continue;
    if (y + snap.h > A4.h - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
    pdf.addImage(snap.img, "PNG", MARGIN, y, snap.w, snap.h);
    y += snap.h + 6;
  }

  if (tableRows.length) {
    if (y > A4.h - 60) {
      pdf.addPage();
      y = MARGIN;
    }
    const head = [["Nombre", "Estado", "Responsable", "Creación", "Vencimiento", "Etiquetas"]];
    const body: RowInput[] = tableRows.map((t) => [
      t.nombre_de_la_tarea ?? t.id_de_tarea ?? "—",
      t.progreso ?? "—",
      t.asignado_a ?? "—",
      t.fecha_de_creacion ? new Date(t.fecha_de_creacion).toLocaleDateString() : "—",
      t.fecha_de_vencimiento ? new Date(t.fecha_de_vencimiento).toLocaleDateString() : "—",
      (t.etiquetas_normalizadas ?? []).join(", "),
    ]);

    autoTable(pdf, {
      startY: y,
      head,
      body,
      styles: { fontSize: 8, cellPadding: 2, lineColor: [230, 230, 230], lineWidth: 0.1 },
      headStyles: { fillColor: [245, 245, 245], textColor: [33, 37, 41] },
      theme: "striped",
      margin: { left: MARGIN, right: MARGIN },
      didDrawPage: (data: { settings: { startY: number } }) => {
        pdf.setFontSize(10);
        pdf.text("Detalle de tareas", MARGIN, data.settings.startY - 4);
      },
    });
  }

  paginate(pdf);
  pdf.save(`${fileName}.pdf`);
}
