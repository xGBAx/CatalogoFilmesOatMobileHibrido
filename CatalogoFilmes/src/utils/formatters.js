export function formatReleaseDate(dateString) {
  if (!dateString) return 'Ano N/A';
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}