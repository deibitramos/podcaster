import z from 'zod';
import { createFileRoute, useParams } from '@tanstack/react-router';

export const Route = createFileRoute('/podcast/$id')({
  component: PodcastView,
  params: z.object({ id: z.coerce.number() }),
});

function PodcastView() {
  const { id } = useParams({ from: '/podcast/$id' });
  return <div className="p-2">{`TODO: Podcast ${id} View page`}</div>;
}
