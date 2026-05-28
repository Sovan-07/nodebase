import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";


//Hook, fatches all workflows using suspense
export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

//Hook, creates new workflow

export const useCreateWorkflow = ()=>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Workflow "${data.name}" created`);
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                )
            },
            onError:(error) => {
                toast.error(`Failed to create workflow : ${error.message}`)
            }
        })
    )
}

//Hook to remove a workflow

export const useRemoveWorkflow = ()=>{
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess : (data)=>{
                toast.success(`Workflow "${data.name}" removed`);
                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryFilter({id:data.id})
                )
            }
        })
    )
}

//hook to fetch single workflow using suspense

export const useSuspenseWorkflow = (id:string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id}))
}

//Hook, update a existing workflow

export const useUpdateWorkflowName = ()=>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Workflow "${data.name}" updated`);
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                );
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({id:data.id})
                )
            },
            onError:(error) => {
                toast.error(`Failed to update workflow : ${error.message}`)
            }
        })
    )
}

//Hook, update a  workflow

export const useUpdateWorkflow = ()=>{
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.update.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Workflow "${data.name}" saved`);
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({}),
                );
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({id:data.id})
                )
            },
            onError:(error) => {
                toast.error(`Failed to save workflow : ${error.message}`)
            }
        })
    )
}
//hook to execute a workflow
export const useExecutwWorkflow = ()=>{
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.execute.mutationOptions({
            onSuccess:(data)=>{
                toast.success(`Workflow "${data.name}" executed`);
            },
            onError:(error) => {
                toast.error(`Failed to execute workflow : ${error.message}`)
            }
        })
    )
}