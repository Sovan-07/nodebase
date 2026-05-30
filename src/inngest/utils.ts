import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";

export const topologicalSort = (nodes: Node[], connections: Connection[]): Node[] => {
    if (connections.length === 0) {
        return nodes;
    }

    //create edges array for toposort 
    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId,
    ])


    const connectedNodeIds = new Set<string>();
    for (const conn of connections) {
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }
    for (const node of nodes) {
        if (!connectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id])
        }
    }
    //Perform topological sort 
    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges);
        //remove duplicates
        sortedNodeIds = [...new Set(sortedNodeIds)];
    }
    catch(e){
        if(e instanceof Error && e.message.includes("Cyclick")){
            throw new Error("Workflow contains a cycle");
        }
        throw e;
    }

    //map sorted ids back to node objects
    const nodeMap = new Map(nodes.map((n)=>[n.id, n]));

    return sortedNodeIds.map((id)=>nodeMap.get(id)!).filter(Boolean);
    


}
