"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { type DeepseekFormValues, DeepseekDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDeepseekRealtimeToken } from "./action";
import { ANTHROPIC_CHANNEL } from "@/inngest/channels/amthropic-node";
import { GROK_CHANNEL } from "@/inngest/channels/grok-node";
import { DEEPSEEK_CHANNEL } from "@/inngest/channels/deepseek-node";

type DeepseekNodeData = {
    variableName?:string;
    systemPrompt?:string;
    userPrompt?:string;
};

type DeepseekNodeType = Node<DeepseekNodeData>;

export const DeepseekNode = memo((props:NodeProps<DeepseekNodeType>)=>{
    const nodeData = props.data;
    const description = nodeData?.userPrompt
        ?`deepseek-chat: ${nodeData.userPrompt.slice(0,50)}...`
        :"Not Configured";
    
    const nodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:DEEPSEEK_CHANNEL,
        topic : "status",
        refreshToken:fetchDeepseekRealtimeToken
    });
    const [dialogOpen , setDialogOpen] = useState(false);
    const handleOpenSettings = ()=>setDialogOpen(true);
    const {setNodes} = useReactFlow();
    const handleSubmit = (values:DeepseekFormValues)=>{
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
            <DeepseekDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    icon="/logos/deepseek.svg"
                    name="DeepSeek"
                    description={description}
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
        </>
    )
})
DeepseekNode.displayName="DeepseekNode";