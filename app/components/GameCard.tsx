import GameThumbnail from "./GameThumbnail";
import Link from "next/link";

type Game = {
  id: string;
  name: string;
  universeId: number;
  image: string;
  players: string;
  rating: string;
  updated: string;
};

type Props = {
  game: Game;
  codes: string[];
  playerCount: number;
  onClick: () => void;
};

export default function GameCard({ game, codes, playerCount }: Props) {
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
            <span>{(playerCount ?? 0).toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>🎁 Active Codes</span>
            <span>{codes.length}</span>
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

        <div className="mt-6 rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold transition group-hover:bg-blue-500">
          View Codes →
        </div>
      </div>
    </Link>
  );
}