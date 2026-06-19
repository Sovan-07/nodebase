import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { anthropicChannel } from "@/inngest/channels/amthropic-node";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});

type AnthropicData = {
    credentialId?:string;
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({ data, nodeId, context, userId, step, publish }) => {
    await publish(
        anthropicChannel().status({
            nodeId,
            status: "loading",
        })
    )

    if (!data.variableName) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Anthropic node: Variable name is missing")
    }

    if (!data.userPrompt) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Anthropic node: user prompt is missing")
    }
    if (!data.credentialId) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Anthropic node: Credential is missing")
    }

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "You are a helpful assistant.";

    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    const credential= await step.run("get-credential" , ()=> {
        return prisma.credential.findUnique({
            where: {
                id:data.credentialId,
                userId,
            }
        })
    });
    if(!credential) {
        throw new NonRetriableError("Anthropic node: Credential not found");
    }

    const anthropic = createAnthropic({
            apiKey: credential.value,
    })

    try {
        const { steps } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model: anthropic("claude-opus-4-5"),
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
            anthropicChannel().status({
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
    } catch(e) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw e;
    }
}