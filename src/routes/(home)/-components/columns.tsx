import { Column } from '@/components/DataTable';
import { formatDateToNow } from '@/lib/dates';
import { Podcast } from '@/entities/podcast';
import PlayerCell from '@/components/player/PlayerCell';
import { TitleCell } from './TitleCell';

export const columns: Column<Podcast>[] = [
  {
    label: '#',
    key: 'id',
    className: 'w-14 text-center align-middle',
    cell: podcast => <PlayerCell podcastId={podcast.id} />,
  },
  { key: 'name', label: 'Name', cell: podcast => <TitleCell podcast={podcast} /> },
  { key: 'genres', label: 'Genres', className: 'hidden sm:table-cell' },
  {
    label: 'Released',
    className: 'hidden sm:table-cell',
    cell: podcast => formatDateToNow(podcast.releaseDate),
  },
];
