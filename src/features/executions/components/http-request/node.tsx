"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { GlobeIcon } from "lucide-react";
import { type FormType, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
    endpoint?:string;
    method?:"GET"|"POST"|"PUT"|"PATCH"|"DELETE";
    body?:string;
    [key:string]:unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props:NodeProps<HttpRequestNodeType>)=>{
    const nodeData = props.data;
    const description = nodeData?.endpoint
        ?`${nodeData.method || "GET"} : ${nodeData.endpoint}`
        :"Not Configured";
    
    const nodeStatus = "success";
    const [dialogOpen , setDialogOpen] = useState(false);
    const handleOpenSettings = ()=>setDialogOpen(true);
    const {setNodes} = useReactFlow();
    const handleSubmit = (values:FormType)=>{
        setNodes((nodes)=>nodes.map((node)=>{
            if(node.id===props.id) {
                return {
                    ...node,
                    data:{
                        ...node.data,
                        endpoint:values.endpoint,
                        method:values.method,
                        body:values.body,
                    }
                }
            }
            return node;
        }))
    }
    
    return (
        <>
            <HttpRequestDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultEndpoint={nodeData.endpoint}
                defaultMethod={nodeData.method}
                defaultBody={nodeData.body}

            />
                <BaseExecutionNode
                    {...props}
                    id={props.id}
                    icon={GlobeIcon}
                    name="HTTP Request"
                    description={description}
                    status={nodeStatus}
                    onSettings={handleOpenSettings}
                    onDoubleClick={handleOpenSettings}
                />
        </>
    )
})
HttpRequestNode.displayName="HttpRequestNode";