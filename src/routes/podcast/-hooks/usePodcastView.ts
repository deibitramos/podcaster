import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, useRouter } from '@tanstack/react-router';
import { query } from '@/api/episodes';

const usePodcastView = () => {
  const [filter, setFilter] = useState('');
  const { id } = useParams({ from: '/podcast/$id' });
  const router = useRouter();
  const { data } = useSuspenseQuery(query.episodes(id));

  const goBack = () => {
    router.history.back();
  };

  return { data, filter, setFilter, goBack };
};

export default usePodcastView;
