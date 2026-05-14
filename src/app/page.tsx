import LogoutButton from "@/features/auth/components/LogoutButton";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

export default async function Home() {
  await requireAuth();
  const data = await caller.getUser();
  return (
    <div className="text-red-500">
      {JSON.stringify(data)}
      <LogoutButton/>
    </div>
    
  );
}
