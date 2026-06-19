import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createDeepSeek } from "@ai-sdk/deepseek"
import { grokChannel } from "@/inngest/channels/grok-node";
import { deepseekChannel } from "@/inngest/channels/deepseek-node";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});

type DeepseekData = {
    credentialId?:string;
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const deepseekExecutor: NodeExecutor<DeepseekData> = async ({ data, nodeId, context, userId,step, publish }) => {
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

    if (!data.credentialId) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Deepseek node: Credential is missing")
    }

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "You are a helpful assistant.";

    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    const credential= await step.run("get-credential" , ()=> {
        return prisma.credential.findUnique({
            where: {
                id:data.credentialId,
                userId
            }
        })
    });
    if(!credential) {
        throw new NonRetriableError("DeepSeek node: Credential not found");
    }

    const deepseek = createDeepSeek({
        apiKey:credential.value
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
    } catch(e) {
        await publish(
            deepseekChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw e;
    }
}