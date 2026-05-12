import { caller } from "@/trpc/server";
import Image from "next/image";

export default async function Home() {
  const users = await caller.getUser();
  return (
    <div className="text-red-500">
      {JSON.stringify(users)}
    </div>
  );
}
