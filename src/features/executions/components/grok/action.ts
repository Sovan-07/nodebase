"use server"
import { grokChannel } from "@/inngest/channels/grok-node";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

export type GrokToken = Realtime.Token<
    typeof grokChannel,
    ["status"]
>;

export async function fetchGrokRealtimeToken():Promise<GrokToken>{
    const token = await getSubscriptionToken(inngest, {
        channel:grokChannel(),
        topics:["status"],
    });
    return token;
}