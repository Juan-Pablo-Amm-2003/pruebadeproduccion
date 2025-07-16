// utils/etiquetasUtils.ts
export const normalizeEtiquetas = (
  etiquetas?: string,
  nombre_del_deposito?: string
): string[] => {
  const normalize = (str: string) =>
    str
      .normalize('NFD') // elimina tildes
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const etiquetasArray = etiquetas
    ? etiquetas
        .split(',')
        .map((e) => normalize(e))
        .filter(Boolean)
    : [];

  // ✅ Aseguramos que "Efectividad Verificada" siempre esté presente si viene en nombre_del_deposito
  if (
    nombre_del_deposito &&
    normalize(nombre_del_deposito) === 'efectividad verificada' &&
    !etiquetasArray.includes('efectividad verificada')
  ) {
    etiquetasArray.push('efectividad verificada');
  }

  return etiquetasArray;
};
