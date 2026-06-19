import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { useExecutionsParams } from "./use-executions-params";


//Hook, fatches all executions using suspense
export const useSuspenseExecutions = () => {
    const trpc = useTRPC();
    const [params] = useExecutionsParams();
    return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
}




//hook to fetch single Execution using suspense

export const useSuspenseExecution = (id:string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.executions.getOne.queryOptions({id}))
}

