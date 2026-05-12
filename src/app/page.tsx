import prisma from "@/lib/db";
import Image from "next/image";

export default async function Home() {
  const users = await prisma.user.findMany();
  return (
    <div className="text-red-500">
      {JSON.stringify(users)}
    </div>
  );
}
