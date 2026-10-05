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

  export const toDateKey=(date)=> {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }  

  export const formatLongDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
 

  export const getNextDays=()=> {

    const days = [];
    for(let i=0; i<7; i++) {
        const day=new Date();
        day.setDate(day.getDate() + i);
        days.push(day);
    }
    return days;
};