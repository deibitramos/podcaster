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
    className: 'w-80',
    cell: episode => <TitleCell episode={episode} />,
  },
  {
    key: 'description',
    label: 'Topic',
    className: 'hidden lg:table-cell',
    cell: episode => <p className="text-ellipsis line-clamp-3">{episode.description}</p>,
  },
  {
    key: 'releaseDate',
    label: 'Released',
    className: 'hidden sm:table-cell',
    cell: episode => formatDateToNow(episode.releaseDate),
  },
  {
    key: 'duration',
    label: 'Duration',
    className: 'hidden sm:table-cell',
    cell: episode => calculateDuration(episode.duration),
  },
];
