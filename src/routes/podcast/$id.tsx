import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/podcast/$id')({
  component: PodcastView,
  params: {
    parse: ({ id }) => ({ id: Number(id) }),
    stringify: ({ id }) => ({ id: String(id) }),
  },
});

function PodcastView() {
  const { id } = Route.useParams();
  return <div className="p-2">{`TODO: Podcast ${id} View page`}</div>;
}
