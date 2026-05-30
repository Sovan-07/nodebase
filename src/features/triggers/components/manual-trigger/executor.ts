import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData = Record<string , unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({nodeId , context , step})=>{
    const result = await step.run("mannual-trigger", async ()=> context);

    //TODO : Publish "Success state foe manual trigger"
    return result;
}