import type { inferInput } from "@trpc/tanstack-react-query";
import {prefetch , trpc} from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;
//prefetch all Credentials
export const prefetchCredentials = (params:Input) => {
    return prefetch(trpc.credentials.getMany.queryOptions(params))
}

//prefetch single Creedential

export const prefetchCredential = (id:string) =>{
    return prefetch(trpc.credentials.getOne.queryOptions({id}))
}