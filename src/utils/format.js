export const formatRuntime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  export const formatDayMonth = (dateString) =>
  new Date(dateString)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
    .toUpperCase();