import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createDeepSeek } from "@ai-sdk/deepseek"
import { grokChannel } from "@/inngest/channels/grok-node";
import { deepseekChannel } from "@/inngest/channels/deepseek-node";

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});

type DeepseekData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const deepseekExecutor: NodeExecutor<DeepseekData> = async ({ data, nodeId, context, step, publish }) => {
    await publish(
        deepseekChannel().status({
            nodeId,
            status: "loading",
        })
    )

    if (!data.variableName) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Deepseek node: Variable name is missing")
    }

    if (!data.userPrompt) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Deepseek node: user prompt is missing")
    }

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "You are a helpful assistant.";

    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    const credentialValue = process.env.DEEPSEEK_API_KEY!;

    if(!credentialValue) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Deepseek node: API Key is missing/invalid")
    }

    const deepseek = createDeepSeek({
        apiKey:credentialValue
    })

    try {
        const { steps } = await step.ai.wrap(
            "deepseek-generate-text",
            generateText,
            {
                model: deepseek("deepseek-chat"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true
                }

            }
        );
        const text =
            steps[0].content[0].type === "text"
                ? steps[0].content[0].text
                : "";

        await publish(
            deepseekChannel().status({
                nodeId,
                status: "success"
            })
        )
        return {
            ...context,
            [data.variableName]: {
                text,
            }
        }
    } catch {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error",
            })
        )
        return context;
    }
}