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
  loader: async ({ context: { qc }, params: { id } }) => {
    await qc.prefetchQuery(query.episodes(id));
  },
  pendingComponent: () => <Spinner />,
  errorComponent: () => <div>Error loading podcast</div>,
});

function PodcastView() {
  const { data, filter, setFilter, goBack } = usePodcastView();

  return (
    <>
      <div className="flex h-[50px] gap-5 mt-1.5 mb-5">
        <Button onClick={goBack}>
          <ChevronLeftIcon fontSize="large" />
        </Button>
        <SearchBar filter={filter} setFilter={setFilter} />
        <div
          className={cn('w-full h-[280px] mt-[22px] rounded-[15px] bg-podcast',
            'bg-cover bg-no-repeat bg-center')}
          data-testid="header-image"
        />
        <div className="mb-20">
          <div className="grid grid-cols-podcastView gap-2 lg:-mb-16 lg:gap-24">
            <PlayerCell
              podcastId={data.podcast.id}
              episodeId={data.episodes[0].id}
              className="h-[60px] w-[60px]"
            />
            <span className="text-[32px] text-center text-white font-bold">
              {data.podcast.name}
            </span>
          </div>
          <DataTable columns={columns} data={data.episodes} />
        </div>
      </div>
    </>
  );
}
