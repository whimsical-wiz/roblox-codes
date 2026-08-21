import GameThumbnail from "./GameThumbnail";
import Link from "next/link";
import Image from "next/image";
type Game = {
  id: string;
  name: string;
  universeId: number;
  image: string;
  players: string;
  rating: string;
  updated: string;
  codes: string[];
  expired: string[];
};

type Props = {
  game: Game;
  onClick: () => void;
};

export default function GameCard({ game, onClick }: Props) {
  return (
    <Link
  href={`/games/${game.id}`}
  className="group block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
  >
     <div className="overflow-hidden">
<GameThumbnail
  gameName={game.name}
  universeId={game.universeId}
/>
</div>
      <div className="p-6 text-left">
        <div className="flex items-center justify-between">
  <h4 className="text-xl font-bold transition group-hover:text-blue-400">
    {game.name}
  </h4>

  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
    NEW
  </span>
</div>

        <div className="mt-4 space-y-2 text-sm text-slate-400">
  <div className="flex justify-between">
    <span>👥 Players</span>
    <span>{game.players}</span>
  </div>

  <div className="flex justify-between">
    <span>⭐ Rating</span>
    <span>{game.rating}</span>
  </div>

  <div className="flex justify-between">
    <span>🕒 Updated</span>
    <span>{game.updated}</span>
  </div>
</div>

        <div className="mt-5 flex items-center justify-between">
          <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
            {game.codes.length} Active Codes
          </span>

           <span className="font-semibold text-blue-400 transition group-hover:translate-x-1">
  View Codes →
</span>
        </div>
      </div>
    </Link>
  );
}