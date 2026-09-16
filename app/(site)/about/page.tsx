import type { Metadata } from "next";
import { StaticContentPage } from "@/components/shared/StaticContentPage";

export const metadata: Metadata = { title: "About | New England Distribution" };

export default function AboutPage() {
  return (
    <StaticContentPage eyebrow="About us" title="New England Smoke Distribution">
      <p>We serve licensed retail buyers with a broad wholesale catalog and account-based pricing.</p>
      <h2>Wholesale support</h2>
      <p>Our team helps approved buyers navigate products, catalog availability, ordering, and account questions.</p>
      <p>Contact us at <a href="mailto:sales@newenglanddistro.com">sales@newenglanddistro.com</a> or <a href="tel:+16175486419">+1 617-548-6419</a>.</p>
    </StaticContentPage>
  );
}
