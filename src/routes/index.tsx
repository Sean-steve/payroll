import { createFileRoute } from "@tanstack/react-router";
import VeloraApp from "@/velora/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
       { title: "VeloraHR | HR & Payroll Portal" },
      {
        name: "description",
        content:
           "Explore VeloraHR's HR and payroll portal for Kenyan workplaces, including attendance, leave, employee self-service, and payroll.",
      },
       { property: "og:title", content: "VeloraHR | HR & Payroll Portal" },
      {
        property: "og:description",
        content:
           "Explore VeloraHR's HR and payroll portal for Kenyan workplaces, including attendance, leave, employee self-service, and payroll.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <VeloraApp />;
}
