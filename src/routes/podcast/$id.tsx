import { type } from 'arktype';
import { createFileRoute } from '@tanstack/react-router';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { cn } from '@/lib/cn';
import { DataTable } from '@/components/DataTable';
import PlayerCell from '@/components/player/PlayerCell';
import { query } from '@/api/episodes';
import usePodcastView from './-hooks/usePodcastView';
import { columns } from './-components/columns';
import typeWithParse from '@/lib/typeWithParse';

export const Route = createFileRoute('/podcast/$id')({
  component: PodcastView,

  params: typeWithParse(type({ id: 'string.integer.parse' })),
  loader: ({ context: { qc }, params: { id } }) => {
    void qc.prefetchQuery(query.episodes(id));
  },
  pendingComponent: () => <Spinner size="xl" />,
  errorComponent: () => <div>Error loading podcast</div>,
});

function PodcastView() {
  const { data, filter, setFilter, goBack } = usePodcastView();
  const filterValue = filter.toLowerCase();
  const episodes = data.episodes.filter(x => x.title.toLowerCase().includes(filterValue));

  return (
    <>
      <div className="flex h-14 gap-4 mt-1.5 mb-5">
        <Button onClick={goBack} size="lg" className="w-10 my-2">
          <ChevronLeftIcon fontSize="large" />
        </Button>
        <SearchBar filter={filter} setFilter={setFilter} />
      </div>
      <div
        className={cn('w-full h-[280px] mt-4 rounded-[15px] bg-podcast',
          'bg-cover bg-no-repeat bg-center')}
        data-testid="header-image"
      />
      <div className="mb-20">
        <div className="grid grid-cols-podcast-view gap-2 lg:gap-24 items-center">
          <PlayerCell
            podcastId={data.podcast.id}
            episodeId={data.episodes[0].id}
            className="size-16"
          />
          <span className="text-[32px] text-center text-white font-bold">
            {data.podcast.name}
          </span>
        </div>
        <DataTable columns={columns} data={episodes} />
      </div>
    </>
  );
}
