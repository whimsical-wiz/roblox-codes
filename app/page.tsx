"use client";

import { useEffect, useState } from "react";
import { games } from "./data/games";
import { codes } from "@/app/data/codes";
import GameCard from "./components/GameCard";

export default function Home() {
 const [selectedGame, setSelectedGame] = useState<(typeof games)[number] | null>(null);
const [copiedCode, setCopiedCode] = useState("");
const [search, setSearch] = useState("");
const [playerCounts, setPlayerCounts] = useState<Record<string, number>>({});
useEffect(() => {
  fetch("/api/games/players")
    .then((response) => response.json())
    .then((data) => {
  console.log("PLAYER COUNTS:", data);
  setPlayerCounts(data);
})
    .catch((error) => console.error("Failed to fetch player counts:", error));
}, []);
const filteredGames = games.filter((game) =>
  game.name.toLowerCase().includes(search.toLowerCase())
);
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold">
            🎮 Roblox<span className="text-blue-500">Codes</span>
          </h1>

          <button
  onClick={() =>
    document.getElementById("games")?.scrollIntoView({ behavior: "smooth" })
  }
  className="rounded-lg bg-blue-600 px-5 py-2 transition hover:bg-blue-700"
>
  Browse Games
</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <h2 className="text-5xl font-bold">
          Latest Roblox Game Codes
        </h2>

        <p className="mt-5 max-w-2xl text-lg text-slate-400">
          Discover active Roblox promo codes, redeem rewards, and stay updated
          with every game update.
        </p>

        <input
  type="text"
  value={search}
  onChange={(event) => setSearch(event.target.value)}
  placeholder="🔍 Search for a game..."
  className="mt-10 w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 outline-none focus:border-blue-500"
/>
      </section>
      <section id="games" className="mx-auto max-w-7xl px-6 pb-20">
  <h3 className="mb-8 text-3xl font-bold">
  {search ? `Search Results for "${search}"` : "🔥 Trending Games"}
</h3>
<p className="mb-8 text-slate-400">
  {filteredGames.length} game
  {filteredGames.length === 1 ? " found" : "s found"}
</p>
{search && (
  <button
    onClick={() => {
      setSearch("");
      setSelectedGame(null);
    }}
    className="mb-6 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-blue-500 hover:text-white"
  >
    Clear search
  </button>
)}

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {filteredGames.map((game) => (
  <GameCard
  key={game.id}
  game={game}
  codes={codes[game.id as keyof typeof codes] ?? []}
  playerCount={playerCounts[String(game.universeId)] ?? 0}
  onClick={() => setSelectedGame(game)}
/>
))}
  </div>
 {filteredGames.length === 0 && (
  <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
    <h3 className="text-2xl font-bold text-white">
      🔍 No games found
    </h3>

    <p className="mt-2 text-slate-400">
      Can't find the game you're looking for?
    </p>

   <a
  href="https://forms.google.com"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
>
  🎮 Request a Game
</a>
  </div>
)}
 {selectedGame && (
  <div className="mt-8 rounded-2xl border border-blue-500 bg-slate-900 p-6">
    <h3 className="text-2xl font-bold">{selectedGame.name} Codes</h3>

    <p className="mt-2 text-slate-400">
      Click a code to copy it.
    </p>
    {copiedCode && (
  <p className="mt-2 text-sm font-semibold text-green-400">    
    Copied {copiedCode}!
  </p>
)}

    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {(codes[selectedGame.id as keyof typeof codes] ?? []).map((code) => (
        <button
          key={code}
          onClick={() => {
  navigator.clipboard.writeText(code);
  setCopiedCode(code);

  setTimeout(() => {
    setCopiedCode("");
  }, 1500);
}}
          className="rounded-xl bg-slate-800 p-4 text-left font-semibold transition hover:bg-slate-700"
        >
          🎁 {code}
        </button>
      ))}
    </div>
  </div>
)}
  
</section>
<section className="border-t border-slate-800 bg-slate-900/50">
  <div className="mx-auto max-w-7xl px-6 py-16">
    <h3 className="text-3xl font-bold">How to Redeem Roblox Codes</h3>

    <div className="mt-8 grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <p className="text-3xl font-bold text-blue-500">1</p>
        <h4 className="mt-4 text-xl font-semibold">Open the game</h4>
        <p className="mt-2 text-slate-400">
          Launch the Roblox game you want to redeem codes in.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <p className="text-3xl font-bold text-blue-500">2</p>
        <h4 className="mt-4 text-xl font-semibold">Find the Codes button</h4>
        <p className="mt-2 text-slate-400">
          Look for a Codes, Gift, or Twitter icon inside the game.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
        <p className="text-3xl font-bold text-blue-500">3</p>
        <h4 className="mt-4 text-xl font-semibold">Paste and redeem</h4>
        <p className="mt-2 text-slate-400">
          Paste one of the active codes and claim your rewards.
        </p>
      </div>
    </div>
  </div>
</section>
<footer className="border-t border-slate-800">
  <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
    <p>© 2026 RobloxCodes. Not affiliated with Roblox.</p>

    <div className="flex gap-5">
      <a href="#games" className="transition hover:text-white">
        Browse Games
      </a>
      <a href="#games" className="transition hover:text-white">
        Latest Codes
      </a>
    </div>
  </div>
</footer>
    </main>
  );
}