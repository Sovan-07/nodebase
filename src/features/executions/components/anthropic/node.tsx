"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { type AnthropicFormValues, AnthropicDialog } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchAnthropicRealtimeToken } from "./action";
import { ANTHROPIC_CHANNEL } from "@/inngest/channels/amthropic-node";

type AnthropicNodeData = {
    variableName?:string;
    credentialId?:string;
    systemPrompt?:string;
    userPrompt?:string;
};

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props:NodeProps<AnthropicNodeType>)=>{
    const nodeData = props.data;
    const description = nodeData?.userPrompt
        ?`claude-opus-4-5: ${nodeData.userPrompt.slice(0,50)}...`
        :"Not Configured";
    
    const nodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:ANTHROPIC_CHANNEL,
        topic : "status",
        refreshToken:fetchAnthropicRealtimeToken
    });
    const [dialogOpen , setDialogOpen] = useState(false);
    const handleOpenSettings = ()=>setDialogOpen(true);
    const {setNodes} = useReactFlow();
    const handleSubmit = (values:AnthropicFormValues)=>{
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
            <AnthropicDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    icon="/logos/anthropic.svg"
                    name="Anthropic"
                    description={description}
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
        </>
    )
})
AnthropicNode.displayName="AnthropicNode";