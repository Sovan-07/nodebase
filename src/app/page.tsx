"use client"
import { Button } from "@/components/ui/button";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { requireAuth } from "@/lib/auth-utils";
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default  function Home() {
  const trpc = useTRPC();
  const queryClient = useQueryClient()
  const {data} = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess:()=>{
      toast.success("Job queued");
    }
  }));
  return (
    <div className="text-red-500 min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      Protected Route
      <div>
        {JSON.stringify(data)}
      </div>
      <Button onClick={()=>create.mutate()} disabled={create.isPending}>
        Create workflow
      </Button>
      <LogoutButton/>
    </div>
    
  );
}
