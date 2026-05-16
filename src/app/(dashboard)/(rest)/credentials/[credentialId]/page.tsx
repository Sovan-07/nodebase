import { requireAuth } from "@/lib/auth-utils";

interface pageProps {
  params:Promise<{
    credentialId:string;
  }>
}

const Page = async ({params}:pageProps) => {
  await requireAuth();
  const {credentialId} = await params;
  return (
    <p>Credentials id : {credentialId}</p>
  )
}

export default Page
