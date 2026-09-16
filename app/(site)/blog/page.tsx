import type { Metadata } from "next";
import Link from "next/link";
import { StaticContentPage } from "@/components/shared/StaticContentPage";

export const metadata: Metadata = { title: "Blog | New England Distribution" };

export default function BlogPage() {
  return (
    <StaticContentPage eyebrow="Updates" title="News and product insights">
      <p>New articles are being prepared. In the meantime, browse our current wholesale selection.</p>
      <p><Link href="/shop">Browse all products</Link></p>
    </StaticContentPage>
  );
}
