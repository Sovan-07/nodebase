"use client"
import { boolean } from "zod";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useUpgradeModel } from "@/hooks/use-upgrade-model";
import { useRouter } from "next/navigation";

export const WorkflowsList = ()=>{
    const workflows = useSuspenseWorkflows();
    return (
        <div className="flex-1 flex justify-center items-center">
            <p>
               {JSON.stringify(workflows.data, null , 2 )}
            </p>
        </div>
    )
}

export const WorkflowsHeader = ({disabled}:{disabled?:boolean})=>{
    const createWorkflow = useCreateWorkflow();
    const router = useRouter();
    const {handleError , model} = useUpgradeModel();

    const handleCreate = ()=>{
        createWorkflow.mutate(undefined , {
            onSuccess:(data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError:(error)=>{
                handleError(error);
            }
        })
    }
    return(
        <>
            {model}
            <EntityHeader 
                title="Workflows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    )
}

export const WorkflowsContainer = ({children}:{children:React.ReactNode})=>{
    return(
        <EntityContainer
            header = {<WorkflowsHeader/>}
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    )
    
}