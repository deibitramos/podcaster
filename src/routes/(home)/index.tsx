import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)/')({ component: PodcastSearch });

function PodcastSearch() {
  return (
    <div className="p-2">
      <h3 className="color-foreground">TODO: PodcastSearch page</h3>
      <Link to="/podcast/$id" params={{ id: 1 }}>Go To Podcast View</Link>
    </div>
  );
}
