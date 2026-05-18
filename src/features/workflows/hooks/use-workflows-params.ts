import {useQueryStates} from "nuqs"
import { workFlowsParams } from "../params"

export const useWorkflowsParams = ()=>{
    return useQueryStates(workFlowsParams);
}