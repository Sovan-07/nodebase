"use client";
import { boolean } from "zod";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useRouter } from "next/navigation";

import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Execution } from "@/generated/prisma/client";
import { ExecutionStatus } from "@/generated/prisma/enums";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { CheckCircleIcon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();
  console.log(`Executions data : ${executions.data.items}`);
  return (
    <EntityList
      items={executions.data.items}
      getKey={(executions) => executions.id}
      renderItem={(execution) => <ExecutionItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
};

export const ExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      description="View your workflow execution history"
    />
  );
};
export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();
  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};
export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading Executions..." />;
};
export const ExecutionsError = () => {
  return <ErrorView message="Error loading Executions..." />;
};

export const ExecutionsEmpty = () => {
  const router = useRouter();

  return (
    <EmptyView
      message="You haven't any execution yet. Get started by running your
                first workflow"
    />
  );
};

// const credentialsLogos: Record<CredentialType, string> = {
//   [CredentialType.OPENAI]: "/logos/openai.svg",
//   [CredentialType.GEMINI]: "/logos/gemini.svg",
//   [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
//   [CredentialType.GROK]: "/logos/grok.svg",
//   [CredentialType.DEEPSEEK]: "/logos/deepseek.svg",
// };

const getStatusIcon=(status:ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS :
      return <CheckCircleIcon className="size-5 text-green-600" />
    case ExecutionStatus.FAILED :
      return <XCircleIcon className="size-5 text-red-600"/>
    case ExecutionStatus.RUNNING :
      return <Loader2Icon className="size-5 text-blue-600 animate-spin"/>
    default :
      return <ClockIcon className="size-5 text-muted-foreground"/>

  }
}
const formateStatus = (status:ExecutionStatus) => {
  return status.charAt(0)+status.slice(1).toLowerCase();
}
export const ExecutionItem = ({
  data,
}: {
  data: Execution & { workflow: { id: string; name: string } };
}) => {
  const duration = data.completedAt
    ? Math.round(
        (new Date(data.completedAt).getTime() -
          new Date(data.startedAt).getTime()) /
          1000,
      )
    : null;
  const subtitle = (
    <>
      {data.workflow.name} &bull; Started {" "}
      {formatDistanceToNow(data.startedAt , {addSuffix:true})}
      {duration!==null && <>&bull; Took {duration}s</>}
    </>
  )
  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={formateStatus(data.status)}
      subtitle={subtitle}
      image={<div className="size-8 flex items-center justify-center">
        {getStatusIcon(data.status)}
      </div>}
    />
  );
};
