"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { type DiscordFormValues, DiscordDialog, } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRealtimeToken } from "./action";
import { GEMINI_CHANNEL } from "@/inngest/channels/gemini-node";
import { DISCORD_CHANNEL } from "@/inngest/channels/discord-node";

type DiscordNodeData = {
    webhookUrl?: string;
    content?: string;
    username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props:NodeProps<DiscordNodeType>)=>{
    const nodeData = props.data;
    const description = nodeData?.content
        ?`Send: ${nodeData.content.slice(0,50)}...`
        :"Not Configured";
    
    const nodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:DISCORD_CHANNEL,
        topic : "status",
        refreshToken:fetchDiscordRealtimeToken
    });
    const [dialogOpen , setDialogOpen] = useState(false);
    const handleOpenSettings = ()=>setDialogOpen(true);
    const {setNodes} = useReactFlow();
    const handleSubmit = (values:DiscordFormValues)=>{
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
            <DiscordDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    icon="/logos/discord.svg"
                    name="Discord"
                    description={description}
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
        </>
    )
})
DiscordNode.displayName="DiscordNode";