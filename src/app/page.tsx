import { CommunityBand } from "~/components/landing/community-band";
import { FeatureOrbitSection } from "~/components/landing/feature-orbit-section";
import { FeaturePillars } from "~/components/landing/feature-pillars";
import { LandingHero } from "~/components/landing/landing-hero";
import { LandingNavigation } from "~/components/landing/landing-navigation";
import { RevealSection } from "~/components/landing/reveal-section";
import { SiteFooter } from "~/components/landing/site-footer";
import { TestimonialRow } from "~/components/landing/testimonial-row";
import { getSession } from "~/server/better-auth/server";

export default async function Home() {
  const session = await getSession();
  const signedIn = Boolean(session);

  return (
    <main className="landing-page">
      <div className="landing-mesh" aria-hidden />
      <div className="relative z-1">
        <LandingNavigation
          signedIn={signedIn}
          user={
            session
              ? {
                  name: session.user.name,
                  email: session.user.email,
                  image: session.user.image,
                }
              : null
          }
        />
        <RevealSection className="w-full">
          <LandingHero signedIn={signedIn} />
        </RevealSection>
        <RevealSection className="w-full">
          <FeaturePillars />
        </RevealSection>
        <RevealSection className="w-full">
          <FeatureOrbitSection />
        </RevealSection>
        <RevealSection className="w-full">
          <CommunityBand />
        </RevealSection>
        <RevealSection className="w-full">
          <TestimonialRow />
        </RevealSection>
        <RevealSection className="w-full">
          <SiteFooter />
        </RevealSection>
      </div>
    </main>
  );
}
