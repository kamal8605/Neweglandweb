import type { Metadata } from "next";
import { StaticContentPage } from "@/components/shared/StaticContentPage";

export const metadata: Metadata = { title: "Privacy Policy | New England Distribution" };

export default function PrivacyPolicyPage() {
  return (
    <StaticContentPage eyebrow="Legal" title="Privacy Policy">
      <p><strong>Last updated:</strong> September 16, 2026</p>
      <h2>Information we collect</h2>
      <p>We collect account, business, contact, delivery, and order information needed to operate our wholesale service. We may also collect technical information required for security and service reliability.</p>
      <h2>How we use information</h2>
      <p>Information is used to review wholesale applications, provide account access, fulfill orders, support customers, prevent abuse, and meet legal obligations.</p>
      <h2>Sharing and retention</h2>
      <p>We share information only with service providers and authorities when necessary to operate the service or comply with law. Records are retained only as long as required for business and legal purposes.</p>
      <h2>Your choices</h2>
      <p>For access, correction, deletion, or privacy questions, contact <a href="mailto:sales@newenglanddistro.com">sales@newenglanddistro.com</a>.</p>
      <p><strong>This policy should be reviewed by qualified legal counsel before production use.</strong></p>
    </StaticContentPage>
  );
}
