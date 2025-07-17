// ✅ Normaliza etiquetas y nombre_del_deposito
export const normalizeEtiquetas = (
  etiquetas?: string | null,
  nombre_del_deposito?: string | null
): string[] => {
  const normalize = (str: string) =>
    str
      .normalize("NFD") // elimina tildes
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const etiquetasArray = etiquetas
    ? etiquetas
        .split(",")
        .map((e) => normalize(e))
        .filter(Boolean)
    : [];

  if (
    nombre_del_deposito &&
    normalize(nombre_del_deposito) === "efectividad verificada" &&
    !etiquetasArray.includes("efectividad verificada")
  ) {
    etiquetasArray.push("efectividad verificada");
  }

  return etiquetasArray;
};
