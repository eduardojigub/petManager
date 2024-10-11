export function formatDateTime(dateTimeString) {
  const [datePart, timePart] = dateTimeString.split(' ');
  
  const [year, month, day] = datePart.split('-');
  let [hours, minutes] = timePart.match(/\d+/g);
  const period = timePart.slice(-2).toUpperCase();

  // Convert to 24-hour format if needed
  if (period === 'PM' && hours !== '12') hours = parseInt(hours) + 12;
  if (period === 'AM' && hours === '12') hours = '00';

  const date = new Date(year, month - 1, day, hours, minutes);

  // Format as desired
  const options = { month: 'long' };
  const formattedMonth = date.toLocaleDateString('en-US', options);
  const dayWithSuffix = getDayWithSuffix(day);
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${formattedMonth} ${dayWithSuffix}, at ${formattedTime}`;
}

// Function to determine suffix
function getDayWithSuffix(day) {
  const dayNum = parseInt(day, 10);
  const suffix = 
    dayNum === 1 || dayNum === 21 || dayNum === 31 ? 'st' :
    dayNum === 2 || dayNum === 22 ? 'nd' :
    dayNum === 3 || dayNum === 23 ? 'rd' :
    'th';
  return `${dayNum}${suffix}`;
}
