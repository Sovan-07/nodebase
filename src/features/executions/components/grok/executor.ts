import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createXai } from "@ai-sdk/xai"
import { grokChannel } from "@/inngest/channels/grok-node";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});

type GrokData = {
    variableName?: string;
    systemPrompt?: string;
    credentialId?:string,
    userPrompt?: string;
}

export const grokExecutor: NodeExecutor<GrokData> = async ({ data, nodeId, userId, context, step, publish }) => {
    await publish(
        grokChannel().status({
            nodeId,
            status: "loading",
        })
    )

    if (!data.variableName) {
        await publish(
            grokChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Grok node: Variable name is missing")
    }

    if (!data.userPrompt) {
        await publish(
            grokChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Grok node: user prompt is missing")
    }
     if (!data.credentialId) {
        await publish(
            grokChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Grok node: Credential is missing")
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
            throw new NonRetriableError("Grok node: Credential not found");
        }

    const grok = createXai({
            apiKey: credential.value,
    })

    try {
        const { steps } = await step.ai.wrap(
            "grok-generate-text",
            generateText,
            {
                model: grok("grok-3"),
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
            grokChannel().status({
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
    } catch (e){
        await publish(
            grokChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw e;
    }
}