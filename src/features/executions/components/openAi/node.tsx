"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { type OpenAiFormValues, OpenAiDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAiRealtimeToken } from "./action";
import { OPENAI_CHANNEL } from "@/inngest/channels/openAi-node";

type OpenAiNodeData = {
    variableName?:string;
    systemPrompt?:string;
    userPrompt?:string;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props:NodeProps<OpenAiNodeType>)=>{
    const nodeData = props.data;
    const description = nodeData?.userPrompt
        ?`gpt-4.1: ${nodeData.userPrompt.slice(0,50)}...`
        :"Not Configured";
    
    const nodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:OPENAI_CHANNEL,
        topic : "status",
        refreshToken:fetchOpenAiRealtimeToken
    });
    const [dialogOpen , setDialogOpen] = useState(false);
    const handleOpenSettings = ()=>setDialogOpen(true);
    const {setNodes} = useReactFlow();
    const handleSubmit = (values:OpenAiFormValues)=>{
        setNodes((nodes)=>nodes.map((node)=>{
            if(node.id===props.id) {
                return {
                    ...node,
                    data:{
                        ...node.data,
                        ...values
                    }
                }
            }
            return node;
        }))
    }
    
    return (
        <>
            <OpenAiDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    icon="/logos/openai.svg"
                    name="OpenAI"
                    description={description}
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
        </>
    )
})
OpenAiNode.displayName="OpenAiNode";