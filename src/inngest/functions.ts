import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma/enums";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini-node";
import { openAiChannel } from "./channels/openAi-node";
import { anthropicChannel } from "./channels/amthropic-node";
import { grokChannel } from "./channels/grok-node";
import { deepseekChannel } from "./channels/deepseek-node";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow",}, {
    event:"workflows/execute.workflow" , 
    channels:[
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openAiChannel(),
      anthropicChannel(),
      grokChannel(),
      deepseekChannel(),
    ]} ,
  async ({ event , step , publish }) => {
    const workflowId = event.data.workflowId;
    if(!workflowId) {
      throw new NonRetriableError("Workflow id missing ")
    }

    const sortedNodes = await step.run("prepare-workflow" , async()=>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where:{id:workflowId},
        include:{
          nodes:true,
          connections:true,
        },
      });
      return topologicalSort( workflow.nodes , workflow.connections)
    });
    let context = event.data.initialData || {};
    for(const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data:node.data as Record<string , unknown>,
        nodeId:node.id,
        context,
        step,
        publish,
      })
    }
    return {
      workflowId,
      result:context,
      
    }
  }
);

