import {channel , topic} from "@inngest/realtime"
export const GROK_CHANNEL = "grok-execution";
export const grokChannel = channel (GROK_CHANNEL).addTopic(
    topic("status").type<{
        nodeId:string;
        status:"loading"| "success" | "error"
    }>(),
);