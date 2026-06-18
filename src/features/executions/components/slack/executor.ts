import Handlebars from "handlebars"
import { decode } from "html-entities"
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import prisma from "@/lib/db";
import { discordChannel } from "@/inngest/channels/discord-node";
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack-node";

Handlebars.registerHelper("json", (context) => {
    const stringified = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(stringified);
    return safeString;
});

type SlackData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
}

export const slackExecutor: NodeExecutor<SlackData> = async ({ data, nodeId, context, step, publish }) => {
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading",
        })
    )

    if (!data.content) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        throw new NonRetriableError("Slack node: Message content is required")
    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);
    

    try {
        const result = await step.run("slack-webhook", async () => {
            if (!data.webhookUrl) {
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error",
                    })
                )
                throw new NonRetriableError("Slack node: webhook URL is missing")
            }
            await ky.post(data.webhookUrl!, {
                json: {
                    content: content.slice(0, 2000),
                }
            });
            if (!data.variableName) {
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error",
                    })
                )
                throw new NonRetriableError("Slack node: Variable name is missing")
            }
            return {
                ...context,
                [data.variableName]: {
                    messageContent: content.slice(0, 2000),
                },
            }

        })

        await publish(
            slackChannel().status({
                nodeId,
                status: "success"
            })
        )
        return result

    } catch {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            })
        )
        return context;
    }
}