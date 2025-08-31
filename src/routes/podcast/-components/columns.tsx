import { Column } from '@/components/DataTable';
import { calculateDuration, formatDateToNow } from '@/lib/dates';
import { Episode } from '@/entities';
import TitleCell from './TitleCell';
import EpisodePlayerCell from './EpisodePlayerCell';

export const columns: Column<Episode>[] = [
  {
    key: 'id',
    label: '#',
    className: 'w-14 text-center align-middle',
    cell: episode => <EpisodePlayerCell episodeId={episode.id} />,
  },
  {
    label: 'Title',
    className: 'lg:w-72',
    cell: episode => <TitleCell episode={episode} />,
  },
  { key: 'description', label: 'Topic' },
  { key: 'releaseDate', label: 'Released', cell: episode => formatDateToNow(episode.releaseDate) },
  {
    key: 'duration',
    label: 'Duration',
    cell: episode => calculateDuration(episode.duration),
  },
];
