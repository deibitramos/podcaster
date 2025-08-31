import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';

export const formatDateToNow = (dateStr: string): string => { // dateStr is YYYY-MM-DD format
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(currentDate.getDate() - 30);

  const date = new Date(dateStr);
  return date > oneMonthAgo ? formatDistanceToNow(date) : format(date, 'dd/MM/yyyy');
};

const pad = (num: number) => num.toString().padStart(2, '0');

export const calculateDuration = (secs?: number) => {
  if (secs === undefined) return '';
  const seconds = Math.floor(secs % 60);
  const minutes = Math.floor((secs / 60) % 60);
  const hours = Math.floor((secs / 3600) % 24);

  let time = `${pad(minutes)}:${pad(seconds)}`;
  if (hours) {
    time = `${pad(hours)}:${time}`;
  }
  return time;
};
