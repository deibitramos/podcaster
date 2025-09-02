import { createFileRoute } from '@tanstack/react-router';
import { DataTable } from '@/components/DataTable';
import { columns } from './-components/columns';
import usePodcastSearch from './-hooks/usePodcastSearch';
import SearchBar from '@/components/SearchBar';
import { Hero } from '@/components/Hero';
import { Spinner } from '@/components/ui/spinner';
import { ErrorComponent } from '@/components/ui/error';
import { UseQueryResult } from '@tanstack/react-query';
import { Podcast } from '@/entities';

export const Route = createFileRoute('/(home)/')({ component: PodcastSearch });

type ResultsProps = { query: UseQueryResult<Podcast[]> };
function PodcastResults({ query }: ResultsProps) {
  const { isPending, isFetching, isError, data, error, refetch } = query;
  if (isFetching) return <Spinner size="xl" />;
  if (isPending) return null;
  if (isError) return (
    <ErrorComponent
      title="Unable to search podcasts"
      error={error}
      onRetry={() => void refetch()}
      variant="inline"
    />
  );
  return <DataTable data={data} columns={columns} />;
}

function PodcastSearch() {
  const { filter, onChangeFilter, query } = usePodcastSearch();

  return (
    <>
      <Hero />
      <SearchBar filter={filter} setFilter={onChangeFilter} placeholder="Search for podcasts..." />
      <PodcastResults query={query} />
    </>
  );
}

export default PodcastSearch;
