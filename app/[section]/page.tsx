import Dashboard from "@/components/dashboard";
export function generateStaticParams() {
  return [
    "matches",
    "batting",
    "bowling",
    "teams",
    "seasons",
    "players",
    "methodology",
  ].map((section) => ({ section }));
}
export default async function Section({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  return <Dashboard section={(await params).section} />;
}
