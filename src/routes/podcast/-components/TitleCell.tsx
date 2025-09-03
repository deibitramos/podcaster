import { Episode } from '@/entities';

type Props = { episode: Episode };

function TitleCell({ episode }: Props) {
  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <img
        className="w-[45px] h-[45px] rounded-lg"
        src={episode.thumbnailUrl}
        alt={episode.title}
      />
      <span className="text-white">{episode.title}</span>
    </div>
  );
}

export default TitleCell;
