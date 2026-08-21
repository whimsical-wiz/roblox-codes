"use client";

import { useEffect, useState } from "react";

type Props = {
  gameName: string;
  universeId: number;
};

export default function GameThumbnail({ gameName, universeId }: Props) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetch(`/api/roblox-thumbnail/${universeId}`)
      .then((res) => res.json())
      .then((data) => {
        setImageUrl(data.imageUrl || "");
      })
      .catch(() => {
        setImageUrl("");
      });
  }, [universeId]);

  return (
    <div className="h-44 w-full overflow-hidden bg-slate-800">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={gameName}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-slate-400">
          Loading...
        </div>
      )}
    </div>
  );
}