export function formatReleaseDate(dateString) {
  if (!dateString) return 'Ano N/A';
  // Converte YYYY-MM-DD para DD/MM/YYYY para passar no Teste Unitário
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}