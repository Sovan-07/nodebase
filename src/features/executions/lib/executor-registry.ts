import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { openAiExecutor } from "../components/openAi/executor";
import { anthropicExecutor } from "../components/anthropic/executor";
import { grokExecutor } from "../components/grok/executor";
import { deepseekExecutor } from "../components/deepseek/executor";

export const executorRegistry : Record<NodeType , NodeExecutor> = {
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER] : googleFormTriggerExecutor,
    [NodeType.STRIPE_TRIGGER] : stripeTriggerExecutor,
    [NodeType.GEMINI]:geminiExecutor,
    [NodeType.ANTHROPIC]:anthropicExecutor,
    [NodeType.OPENAI]:openAiExecutor,
    [NodeType.GROK]:grokExecutor,
    [NodeType.DEEPSEEK]:deepseekExecutor,

};

export const getExecutor = (type:NodeType) : NodeExecutor =>{
    const executor = executorRegistry[type];
    if(!executor) {
        throw new Error(`Node executor found for node type ${type}`);
    }
    return executor;
}