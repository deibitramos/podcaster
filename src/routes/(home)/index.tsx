import { createFileRoute } from '@tanstack/react-router';
import { DataTable } from '@/components/DataTable';
import { columns } from './-components/columns';
import usePodcastSearch from './-hooks/usePodcastSearch';
import SearchBar from '@/components/SearchBar';
import { Spinner } from '@/components/ui/spinner';
import { UseQueryResult } from '@tanstack/react-query';
import { Podcast } from '@/entities';

export const Route = createFileRoute('/(home)/')({ component: PodcastSearch });

type ResultsProps = { query: UseQueryResult<Podcast[]> };
function PodcastResults({ query }: ResultsProps) {
  const { isPending, isFetching, isError, data } = query;
  if (isPending) return null;
  if (isFetching) return <Spinner />;
  if (isError) return <div>Error loading podcasts</div>;
  return <DataTable data={data} columns={columns} />;
}

function PodcastSearch() {
  const { filter, onChangeFilter, query } = usePodcastSearch();

  return (
    <>
      <SearchBar filter={filter} setFilter={onChangeFilter} />
      <PodcastResults query={query} />
    </>
  );
}

export default PodcastSearch;
