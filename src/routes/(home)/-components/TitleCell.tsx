import { Podcast } from '@/entities';
import { Link } from '@tanstack/react-router';

type Props = { podcast: Podcast };

export function TitleCell({ podcast }: Props) {
  return (
    <div className="flex items-center gap-5">
      <img className="w-[45px] h-[45px] rounded-lg" src={podcast.thumbnailUrl} alt={podcast.name} />
      <div className="flex flex-col">
        <Link
          to="/podcast/$id"
          params={{ id: podcast.id }}
          className="text-white no-underline hover:underline decoration-white"
        >
          <span>{podcast.name}</span>
        </Link>
        <span className="text-muted-foreground">{podcast.author}</span>
      </div>
    </div>
  );
}
