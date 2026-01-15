import PricingSection4 from "@/components/ui/pricing-section-4";

interface PricingSectionProps {
  hideFreeTrial?: boolean;
}

const PricingSection = ({ hideFreeTrial = false }: PricingSectionProps) => {
  return <PricingSection4 hideFreeTrial={hideFreeTrial} />;
};

export default PricingSection;
