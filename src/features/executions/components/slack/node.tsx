"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { type SlackFormValues, SlackDialog, } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchSlackRealtimeToken } from "./action";

import { SLACK_CHANNEL } from "@/inngest/channels/slack-node";

type SlackNodeData = {
    webhookUrl?: string;
    content?: string;
};

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props:NodeProps<SlackNodeType>)=>{
    const nodeData = props.data;
    const description = nodeData?.content
        ?`Send: ${nodeData.content.slice(0,50)}...`
        :"Not Configured";
    
    const nodeStatus = useNodeStatus({
        nodeId:props.id,
        channel:SLACK_CHANNEL,
        topic : "status",
        refreshToken:fetchSlackRealtimeToken
    });
    const [dialogOpen , setDialogOpen] = useState(false);
    const handleOpenSettings = ()=>setDialogOpen(true);
    const {setNodes} = useReactFlow();
    const handleSubmit = (values: SlackFormValues)=>{
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
            <SlackDialog
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    icon="/logos/slack.svg"
                    name="Slack"
                    description={description}
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
        </>
    )
})
SlackNode.displayName="SlackNode";