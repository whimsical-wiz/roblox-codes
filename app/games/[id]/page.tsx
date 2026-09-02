"use client";

import { useEffect, useState } from "react";
import GameThumbnail from "@/app/components/GameThumbnail";
import { notFound, useParams } from "next/navigation";
import { games } from "@/app/data/games";
import { codes, expiredCodes } from "@/app/data/codes";

export default function GamePage() {
  const params = useParams();
  const id = params.id as string;

  const game = games.find((g) => g.id === id);
  const gameCodes = codes[id as keyof typeof codes] ?? [];
  const gameExpiredCodes =
  expiredCodes[id as keyof typeof expiredCodes] ?? [];

  if (!game) {
    notFound();
  }
  const [copied, setCopied] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  useEffect(() => {
  fetch("/api/games/players")
    .then((response) => response.json())
    .then((data) => {
      setPlayerCount(data[String(game.universeId)] ?? 0);
    })
    .catch((error) =>
      console.error("Failed to fetch player count:", error)
    );
}, [game.universeId]);

  

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

 <GameThumbnail
  gameName={game.name}
  universeId={game.universeId}
/>
  <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    <div>
      <h1 className="text-4xl font-bold">
        {game.name} Codes
      </h1>

      <p className="text-gray-400 mt-2">
        Updated {game.updated}
      </p>
    </div>

    <div className="flex gap-6">

      <div className="rounded-xl bg-slate-900 px-5 py-3 border border-slate-800">
        <p className="text-gray-400 text-sm">Players</p>
        <p className="font-bold text-xl">{playerCount.toLocaleString()}</p>
      </div>

      <div className="rounded-xl bg-slate-900 px-5 py-3 border border-slate-800">
        <p className="text-gray-400 text-sm">Rating</p>
        <p className="font-bold text-xl">⭐ {game.rating}</p>
      </div>

    </div>

  </div>

  <div className="mt-10">
        

        <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-semibold">
    Active Codes
  </h2>

  <span className="rounded-full bg-green-500/20 border border-green-500/30 px-3 py-1 text-sm text-green-400">
    🟢 {gameCodes.length} Active
  </span>
</div>
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
  <h2 className="mb-3 text-2xl font-bold">
    About {game.name}
  </h2>

  <p className="text-gray-300 leading-7">
    {game.description}
  </p>
</div>
        

        <div className="space-y-4 mb-10">
         {gameCodes.map((code) => (
            <div
              key={code}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <span className="font-mono">{code}</span>

              <button
   onClick={() =>{
    navigator.clipboard.writeText(code);
    setCopied(code);

    setTimeout(() => {
      setCopied("");
    }, 2000);
  }}
  className="rounded-lg bg-blue-600 px-4 py-2 transition hover:bg-blue-700"
>
  {copied === code ? "✓ Copied!" : "Copy"}
</button>
            </div>
          ))}
        </div>

        
          <div className="flex items-center justify-between mb-4 mt-10">
  <h2 className="text-2xl font-semibold text-red-400">
    Expired Codes
  </h2>

  <span className="rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1 text-sm text-red-400">
    🔴 {gameExpiredCodes.length} Expired
  </span>
</div>
        <div className="space-y-4">
          {gameExpiredCodes.map((code) => (
            <div
              key={code}
              className="rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-300"
            >
              {code}
            </div>
          ))}
        </div>
          <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="mb-4 text-2xl font-bold">
        How to Redeem {game.name} Codes
      </h2>

      <ol className="ml-6 list-decimal space-y-2 text-gray-300">
        <li>Launch {game.name} in Roblox.</li>
        <li>Find the Codes or Settings button.</li>
        <li>Type or paste a working code.</li>
        <li>Click <strong>Redeem</strong>.</li>
        <li>Claim your free rewards!</li>
      </ol>
    </div>

  </div> {/* closes mt-10 */}
</div>   {/* closes max-w-5xl */}
    </main>
  );
}