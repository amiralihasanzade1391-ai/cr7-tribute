"use client";

import dynamic from "next/dynamic";
import { TrophyRoomLoading } from "@/components/trophy-room/TrophyRoomLoading";

const TrophyRoom3D = dynamic(
  () => import("@/components/trophy-room/TrophyRoom3D"),
  {
    ssr: false,
    loading: () => <TrophyRoomLoading />,
  }
);

export default function TrophyRoomPage() {
  return (
    <main className="w-full h-screen bg-[#050505] overflow-hidden">
      <TrophyRoom3D />
    </main>
  );
}
