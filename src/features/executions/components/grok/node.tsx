"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { type GrokFormValues, GrokDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGrokRealtimeToken } from "./action";
import { ANTHROPIC_CHANNEL } from "@/inngest/channels/amthropic-node";
import { GROK_CHANNEL } from "@/inngest/channels/grok-node";

type GrokNodeData = {
    variableName?:string;
    systemPrompt?:string;
    userPrompt?:string;
};

type GrokNodeType = Node<GrokNodeData>;

export const GrokNode = memo((props:NodeProps<GrokNodeType>)=>{
    const nodeData = props.data;
    const description = nodeData?.userPrompt
        ?`grok-3: ${nodeData.userPrompt.slice(0,50)}...`
        :"Not Configured";
    
    const nodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:GROK_CHANNEL,
        topic : "status",
        refreshToken:fetchGrokRealtimeToken
    });
    const [dialogOpen , setDialogOpen] = useState(false);
    const handleOpenSettings = ()=>setDialogOpen(true);
    const {setNodes} = useReactFlow();
    const handleSubmit = (values:GrokFormValues)=>{
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
            <GrokDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    icon="/logos/grok.svg"
                    name="Grok"
                    description={description}
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
        </>
    )
})
GrokNode.displayName="GrokNode";