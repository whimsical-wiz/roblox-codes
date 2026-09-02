import { NextResponse } from "next/server";

export async function GET() {
  const universeIds = [
    994732206,
    6325068386,
    9774981774,
  ];

  const response = await fetch(
    `https://games.roblox.com/v1/games?universeIds=${universeIds.join(",")}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Roblox player data" },
      { status: 500 }
    );
  }

  const data = await response.json();

  const players = Object.fromEntries(
    data.data.map((game: { id: number; playing: number }) => [
      game.id,
      game.playing,
    ])
  );

  return NextResponse.json(players);
}