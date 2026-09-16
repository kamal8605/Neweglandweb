import type { Metadata } from "next";
import { StaticContentPage } from "@/components/shared/StaticContentPage";

export const metadata: Metadata = { title: "Terms and Conditions | New England Distribution" };

export default function TermsPage() {
  return (
    <StaticContentPage eyebrow="Legal" title="Terms and Conditions">
      <p><strong>Last updated:</strong> September 16, 2026</p>
      <h2>Wholesale eligibility</h2>
      <p>Account access and ordering are limited to approved business customers. Customers are responsible for maintaining accurate account and licensing information and for complying with applicable laws.</p>
      <h2>Orders and availability</h2>
      <p>All orders are subject to acceptance, product availability, account approval, and final pricing confirmed by our order system. We may reject or adjust an order when inventory, pricing, or compliance information is incorrect.</p>
      <h2>Age-restricted products</h2>
      <p>Customers must not purchase or resell age-restricted products except as permitted by applicable law and must maintain required age-verification practices.</p>
      <h2>Contact</h2>
      <p>Questions may be sent to <a href="mailto:sales@newenglanddistro.com">sales@newenglanddistro.com</a>.</p>
      <p><strong>These terms should be reviewed by qualified legal counsel before production use.</strong></p>
    </StaticContentPage>
  );
}
