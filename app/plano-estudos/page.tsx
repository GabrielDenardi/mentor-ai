import StudyPlanClient from "./StudyPlanClient";

export const dynamic = "force-dynamic";

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{ subject?: string }>;
}) {
    const { subject = "" } = await searchParams;
    return <StudyPlanClient subject={subject} />;
}
