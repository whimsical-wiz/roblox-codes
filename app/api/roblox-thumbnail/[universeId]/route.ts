import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ universeId: string }> }
) {
  const { universeId } = await params;

  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&size=768x432&format=Png&isCircular=false`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Roblox thumbnail" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const imageUrl = data.data?.[0]?.thumbnails?.[0]?.imageUrl;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No thumbnail found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}