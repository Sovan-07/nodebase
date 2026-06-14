import {channel , topic} from "@inngest/realtime"
export const DEEPSEEK_CHANNEL = "deepseek-execution";
export const deepseekChannel = channel (DEEPSEEK_CHANNEL).addTopic(
    topic("status").type<{
        nodeId:string;
        status:"loading"| "success" | "error"
    }>(),
);