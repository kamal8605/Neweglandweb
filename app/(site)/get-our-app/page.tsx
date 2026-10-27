import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticContentPage } from "@/components/shared/StaticContentPage";
import { appStoreLinks } from "@/lib/homepage";
import { getHomepagePayload } from "@/lib/site";

export const metadata: Metadata = { title: "Get Our App", description: "Download the New England Distribution wholesale app for iPhone, iPad and Android.", alternates: { canonical: "/get-our-app" } };

export default async function GetOurAppPage() {
  const site = (await getHomepagePayload())?.site;
  // API unreachable (the page is revalidated every few minutes): say so instead of guessing links.
  if (!site) return <StaticContentPage eyebrow="Mobile app" title="Get our app"><p>The download links are temporarily unavailable. Please try again shortly.</p></StaticContentPage>;
  const { appStore, playStore } = appStoreLinks(site);
  // No store link configured in the admin: there is no app to offer.
  if (!appStore && !playStore) notFound();
  return (
    <StaticContentPage eyebrow="Mobile app" title="Get our app">
      <p>Browse the catalog, check wholesale prices and reorder from your phone or tablet.</p>
      <ul>
        {appStore && <li><a href={appStore} rel="noopener noreferrer">Download on the App Store</a> (iPhone and iPad)</li>}
        {playStore && <li><a href={playStore} rel="noopener noreferrer">Get it on Google Play</a> (Android)</li>}
      </ul>
    </StaticContentPage>
  );
}
