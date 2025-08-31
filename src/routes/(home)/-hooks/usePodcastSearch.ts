import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/store';
import { query } from '@/api/podcasts';
import useDebounce from '@/lib/useDebounce';

const usePodcastSearch = () => {
  const filter = useAppStore(state => state.filter);
  const setFilter = useAppStore(state => state.setFilter);
  const debouncedFilter = useDebounce(filter);
  const shouldSearch = debouncedFilter.length >= 3;

  const podcastsQuery = useQuery({
    ...query.podcasts(debouncedFilter),
    enabled: shouldSearch,
  });

  const onChangeFilter = (value: string) => {
    setFilter(value);
  };

  return { query: podcastsQuery, filter, onChangeFilter };
};

export default usePodcastSearch;
