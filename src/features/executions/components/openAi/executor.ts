import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { openAiChannel } from "@/inngest/channels/openAi-node";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});

type OpenAiData = {
    credentialId?:string;
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({ data, nodeId, context, userId, step, publish }) => {
    await publish(
        openAiChannel().status({
            nodeId,
            status: "loading",
        })
    )

    if (!data.variableName) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("OpenAI node: Variable name is missing")
    }

    if (!data.userPrompt) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("OpenAI node: user prompt is missing")
    }

    if (!data.credentialId) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("OpenAI node: Credential is missing")
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
        throw new NonRetriableError("OpenAI node: Credential not found");
    }

    const openai = createOpenAI({
            apiKey: credential.value,
    })

    try {
        const { steps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai("gpt-4.1"),
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
            openAiChannel().status({
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
            openAiChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw e;
    }
}