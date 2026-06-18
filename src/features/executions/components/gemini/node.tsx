"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { type GeminiFormValues, GeminiDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./action";
import { GEMINI_CHANNEL } from "@/inngest/channels/gemini-node";

type GeminiNodeData = {
    variableName?:string;
    credentialId?:string;
    systemPrompt?:string;
    userPrompt?:string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props:NodeProps<GeminiNodeType>)=>{
    const nodeData = props.data;
    const description = nodeData?.userPrompt
        ?`gemini-2.5-flash: ${nodeData.userPrompt.slice(0,50)}...`
        :"Not Configured";
    
    const nodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:GEMINI_CHANNEL,
        topic : "status",
        refreshToken:fetchGeminiRealtimeToken
    });
    const [dialogOpen , setDialogOpen] = useState(false);
    const handleOpenSettings = ()=>setDialogOpen(true);
    const {setNodes} = useReactFlow();
    const handleSubmit = (values:GeminiFormValues)=>{
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
            <GeminiDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    icon="/logos/gemini.svg"
                    name="Gemini"
                    description={description}
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
        </>
    )
})
GeminiNode.displayName="GeminiNode";