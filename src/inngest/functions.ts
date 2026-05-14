
// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world"}, {event:"test/hello.world"} ,
  async ({ event , step }) => {
    //fetching
    await step.sleep("fetching" , "7s");
    //trascribing
    await step.sleep("transcribing" ,  "7s");
    //Sending to AI
    await step.sleep("sending-to-AI" ,  "7s");
    
    await step.run("create-workflow" , ()=>{
        return prisma.workflow.create({
            data:{
                name:"workflow-from-ingest"
            }
        })
    })
  }
);

