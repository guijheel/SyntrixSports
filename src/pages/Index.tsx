import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { MatchesSection } from '@/components/MatchesSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { PricingSection } from '@/components/PricingSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <MatchesSection />
      <FeaturesSection />
      <PricingSection />
    </Layout>
  );
};

export default Index;
