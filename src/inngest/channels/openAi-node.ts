import {channel , topic} from "@inngest/realtime"
export const OPENAI_CHANNEL = "openAi-execution";
export const openAiChannel = channel (OPENAI_CHANNEL).addTopic(
    topic("status").type<{
        nodeId:string;
        status:"loading"| "success" | "error"
    }>(),
);