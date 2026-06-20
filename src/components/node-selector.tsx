"use-client";
import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Separator } from "./ui/separator";
import { NodeType } from "@/generated/prisma/enums";
import { GlobeIcon, MousePointer2Icon} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

export type NodeTypeOption = {
    type:NodeType;
    label:string;
    description:string;
    icon:React.ComponentType<{className?:string}>|string;
}

const triggerNodes:NodeTypeOption[] = [
    {
        type:NodeType.MANUAL_TRIGGER,
        label:"Trigger manually",
        description:"Runs the flow on clicking a button. Good for getting started quickly",
        icon:MousePointer2Icon,
    },

    {
        type:NodeType.GOOGLE_FORM_TRIGGER,
        label:"Google Form",
        description:"Runs the flow when a google form is submitted",
        icon:"/logos/googleform.svg",
    },

    {
        type:NodeType.STRIPE_TRIGGER,
        label:"Stripe",
        description:"Runs the flow when a stripe event is captured",
        icon:"/logos/stripe.svg",
    },
];

const messagingNode:NodeTypeOption[] = [
        

    {
        type:NodeType.DISCORD,
        label:"Discord",
        description:"Use Discord",
        icon:"/logos/discord.svg",
    },

    {
        type:NodeType.SLACK,
        label:"Slack",
        description:"Use Slack",
        icon:"/logos/slack.svg",
    },
]

const aiNodes:NodeTypeOption[] = [
    {
        type:NodeType.GEMINI,
        label:"Gemini",
        description:"Use google Gemini",
        icon:"/logos/gemini.svg",
    },
    {
        type:NodeType.OPENAI,
        label:"OpenAI",
        description:"Use OpenAI",
        icon:"/logos/openai.svg",
    },
    {
        type:NodeType.ANTHROPIC,
        label:"Anthropic",
        description:"Use Anthropic",
        icon:"/logos/anthropic.svg",
    },
    {
        type:NodeType.GROK,
        label:"Grok",
        description:"Use Grok",
        icon:"/logos/grok.svg",
    },
     {
        type:NodeType.DEEPSEEK,
        label:"DeepSeek",
        description:"Use DeepSeek",
        icon:"/logos/deepseek.svg",
    },

]

const executionNodes:NodeTypeOption[] = [
    {
        type:NodeType.HTTP_REQUEST,
        label:"HTTP Request",
        description:"Makes an HTTP request",
        icon:GlobeIcon,
    },
]


interface NodeSelectorProps {
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    children:React.ReactNode;
}

export function NodeSelector({
    open,
    onOpenChange,
    children
}:NodeSelectorProps){
    const {setNodes,getNodes,screenToFlowPosition} = useReactFlow();
    const handleNodeSelect = useCallback((selection:NodeTypeOption)=>{
        if(selection.type===NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some(
                (node)=>node.type === NodeType.MANUAL_TRIGGER,
            );
            if(hasManualTrigger) {
                toast.error("Only one manual trigger is allowed per workflow");
                return;
            }
        }
        setNodes((nodes)=>{
            const hasInitialTrigger = nodes.some(
                (node)=> node.type===NodeType.INITIAL,
            );
            const centerX = window.innerWidth/2;
            const centerY = window.innerHeight/2;

            const flowPosition = screenToFlowPosition({
                x:centerX+(Math.random()-0.5)*200,
                y:centerY+(Math.random()-0.5)*200,
            });

            const newNode = {
                id:createId(),
                data:{},
                position:flowPosition,
                type:selection.type,
            };
            if(hasInitialTrigger) {
                return[newNode];
            }

            return [...nodes , newNode];
        });
        onOpenChange(false);
    },[setNodes,getNodes, onOpenChange,screenToFlowPosition])
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        What triggers this workflow?
                    </SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts your workflow.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodes.map((nodeType)=>{
                        const Icon = nodeType.icon;
                        return (
                            <div 
                                key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none
                                cursor-pointer border-l-2 border-transparent hover:border-l-primary"    
                                onClick={()=>handleNodeSelect(nodeType)}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string"?(
                                        <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm"/>
                                    ):(
                                        <Icon className="size-5"/>
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Separator/>
                <SheetHeader>
                    <SheetTitle>
                        What is request node ?
                    </SheetTitle>
                    <SheetDescription>
                        A node used for HTTPS request to backend.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {executionNodes.map((nodeType)=>{
                        const Icon = nodeType.icon;
                        return (
                            <div 
                                key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none
                                cursor-pointer border-l-2 border-transparent hover:border-l-primary"    
                                onClick={()=>handleNodeSelect(nodeType)}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string"?(
                                        <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm"/>
                                    ):(
                                        <Icon className="size-5"/>
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Separator/>
                <SheetHeader>
                    <SheetTitle>
                        What is AI node ?
                    </SheetTitle>
                    <SheetDescription>
                        Use different AI model to generate text.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {aiNodes.map((nodeType)=>{
                        const Icon = nodeType.icon;
                        return (
                            <div 
                                key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none
                                cursor-pointer border-l-2 border-transparent hover:border-l-primary"    
                                onClick={()=>handleNodeSelect(nodeType)}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string"?(
                                        <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm"/>
                                    ):(
                                        <Icon className="size-5"/>
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Separator/>
                <SheetHeader>
                    <SheetTitle>
                        What is messaging node ?
                    </SheetTitle>
                    <SheetDescription>
                        Use different Chating app to get notified.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {messagingNode.map((nodeType)=>{
                        const Icon = nodeType.icon;
                        return (
                            <div 
                                key={nodeType.type}
                                className="w-full justify-start h-auto py-5 px-4 rounded-none
                                cursor-pointer border-l-2 border-transparent hover:border-l-primary"    
                                onClick={()=>handleNodeSelect(nodeType)}
                            >
                                <div className="flex items-center gap-6 w-full overflow-hidden">
                                    {typeof Icon === "string"?(
                                        <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-sm"/>
                                    ):(
                                        <Icon className="size-5"/>
                                    )}
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-medium text-sm">
                                            {nodeType.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}