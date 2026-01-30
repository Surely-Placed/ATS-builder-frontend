import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { SpotlightHeading } from "@/components/ui/spotlight-heading";
import { checkout } from "@/services/subscription";
import { useNavigate } from "react-router-dom";
import { useToast } from '@/hooks/use-toast';
import { useUsage } from '@/context/UsageContext';

const plans = [
  {
    name: "Free Trial",
    planKey: "free" as const,
    description: "Get started with AI-powered resume optimization at no cost",
    price: 0,
    buttonText: "Start Free",
    buttonVariant: "outline" as const,
    includes: [
      "What's included:",
      "10 Resume analyses per month",
      "10 Resume optimizations per month",
      "ATS compatibility scoring",
      "10 PDF exports per month",
      "Advanced ATS optimization",
      "AI-powered keyword suggestions",
    ],
  },
  {
    name: "Premium",
    planKey: "premium" as const,
    description: "Unlimited access for serious job seekers who want to maximize their chances",
    price: 29,
    buttonText: "Upgrade to Premium",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Free Trial, plus:",
      "Unlimited resume analyses",
      "Unlimited resume optimizations",
      "ATS compatibility scoring",
      "Unlimited PDF exports",
      "Advanced ATS optimization",
      "AI-powered keyword suggestions",
    ],
  },
  {
    name: "Enterprise",
    planKey: "enterprise" as const,
    description: "Let our expert team handle everything for you — sit back and land interviews",
    price: 119,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    includes: [
      "Everything in Premium, plus:",
      "Unlimited resume analyses",
      "Unlimited resume optimizations",
      "Advanced ATS optimization",
      "AI-powered keyword suggestions",
      "Dedicated resume specialist",
      "Full resume rewrite service",
      "Personalized optimization strategy",
      "1-on-1 consultation calls",
    ],
  },
];

import { useAuth } from "@/context/AuthContext";

interface PricingSection4Props {
  hideFreeTrial?: boolean;
}

export default function PricingSection4({ hideFreeTrial = false }: PricingSection4Props) {
  const pricingRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const { state: usageState, refresh } = useUsage();
    
  
  const handlePlanClick = async (planKey: 'free' | 'premium' | 'enterprise') => {
    if (planKey !== 'free' && !user) {
      // Redirect to signup/login for non-free plans if not authenticated
      navigate('/signup');
      return;
    }

    setLoadingPlan(planKey);
    try {
      if (planKey === 'free') {
        // If user is logged in and has exhausted their free trial, show toast
        if (user) {
          const remaining = usageState?.remaining;
          const isExhausted = typeof remaining === 'number' ? remaining <= 0 : false;
          if (isExhausted) {
            toast({
              title: 'Free trial exhausted',
              description: 'Your free trial limit has been exhausted — purchase a plan or use your existing plan.',
            });
            setLoadingPlan(null);
            return;
          }
          navigate('/dashboard');
        } else {
          navigate('/signup');
        }
      } else {
        // Prevent subscribing to the same plan again
        if (usageState?.plan === planKey) {
          toast({
            title: 'Already subscribed',
            description: `You are already subscribed to the ${planKey} plan.`,
          });
          setLoadingPlan(null);
          return;
        }

        await checkout(planKey);
        // Refresh usage context after successful checkout to update badge
        if (typeof refresh === 'function') {
          try { await refresh(); } catch (_) {}
        }
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  if (hideFreeTrial) {
    // Compact modal layout: center only paid plans with larger CTAs
    const filtered = plans.filter((p) => p.planKey !== "free");
    return (
      <div className="w-full py-6 px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Plans that works best for you</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Trusted by millions. Explore which option is right for you.</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {filtered.map((plan) => (
            <div key={plan.name} className="bg-white dark:bg-card border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-md">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="text-2xl font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-semibold text-gray-900 dark:text-white">${plan.price}</span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => handlePlanClick(plan.planKey)}
                    className={
                      plan.popular
                        ? "px-6 py-3 rounded-lg bg-black text-white text-lg shadow-lg"
                        : "px-5 py-2 rounded-md bg-white border text-gray-900 text-base"
                    }
                    >
                    {plan.buttonText}
                    {loadingPlan === plan.planKey && (
                      <span className="ml-3 inline-flex items-center" aria-hidden>
                        <span className="w-4 h-4 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" />
                      </span>
                    )}
                  </button>

                  <div className="mt-5 border-t pt-4 text-sm text-gray-600 dark:text-gray-300">
                    <h4 className="font-medium mb-2">{plan.includes[0]}</h4>
                    <ul className="space-y-1">
                      {plan.includes.slice(1).map((f, i) => (
                        <li key={i} className="text-sm">• {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto relative bg-white dark:bg-black overflow-x-hidden pb-20 pt-8"
      ref={pricingRef}
      id="pricing"
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="hidden dark:block absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%_at_center,white,transparent)]"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]"></div>
        <SparklesComp
          density={1800}
          direction="bottom"
          speed={1}
          color="#FFFFFF"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%_at_center,white,transparent_85%)]"
        />
      </TimelineContent>
      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="hidden dark:block absolute left-0 top-[-114px] w-full h-[113.625vh] flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0"
      >
        <div className="framer-1i5axl2">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full"
            style={{
              border: "200px solid hsl(var(--foreground) / 0.3)",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
            data-border="true"
            data-framer-name="Ellipse 1"
          ></div>
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[2053px] flex-none rounded-full dark:border-[#3131f5]"
            style={{
              border: "200px solid hsl(var(--foreground) / 0.2)",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
            data-border="true"
            data-framer-name="Ellipse 2"
          ></div>
        </div>
      </TimelineContent>

      <article className="text-center mb-6 pt-4 max-w-3xl mx-auto space-y-2 relative z-50">
        <SpotlightHeading className="w-full">
          <h2 className="text-4xl font-medium text-gray-900 dark:text-white">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-center"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0,
              }}
            >
              Plans that works best for you
            </VerticalCutReveal>
          </h2>
        </SpotlightHeading>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-gray-600 dark:text-gray-300"
        >
          Trusted by millions. We help teams all around the world. Explore which option is right for
          you.
        </TimelineContent>
      </article>

      {/* Radial gradient effect - dark mode only */}
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 dark:block hidden"
        style={{
          backgroundImage: `radial-gradient(circle at center, #206ce8 0%, transparent 70%)`,
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />

      <div className="grid md:grid-cols-3 max-w-5xl gap-4 py-6 mx-auto px-4">
        {plans
          .filter((p) => (hideFreeTrial ? p.planKey !== 'free' : true))
          .map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative text-gray-900 dark:text-white border-gray-200 dark:border-neutral-800 bg-white dark:bg-transparent ${
                plan.popular
                  ? "shadow-xl shadow-gray-200/50 dark:shadow-[0px_-13px_300px_0px_#0900ff] border-gray-300 dark:border-neutral-700 z-20"
                  : "shadow-lg shadow-gray-100/50 dark:shadow-none z-10"
              }`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between">
                  <h3 className="text-3xl mb-2">{plan.name}</h3>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-semibold">
                    $
                    <NumberFlow
                      format={{
                        currency: "USD",
                      }}
                      value={plan.price}
                      className="text-4xl font-semibold"
                    />
                  </span>
                  <span className="text-gray-500 dark:text-gray-300 ml-1">
                    /month
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <button
                  onClick={() => handlePlanClick(plan.planKey)}
                  className={`w-full mb-6 p-4 text-xl rounded-xl transition-all ${
                    plan.popular
                      ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gradient-to-t dark:from-blue-500 dark:to-blue-600 dark:text-white shadow-lg dark:shadow-blue-800 border border-gray-900 dark:border-blue-500"
                      : plan.buttonVariant === "outline"
                        ? "bg-white text-gray-900 hover:bg-gray-50 dark:bg-gradient-to-t dark:from-neutral-950 dark:to-neutral-600 dark:text-white shadow-md dark:shadow-neutral-900 border-2 border-gray-300 dark:border-neutral-800"
                        : ""
                  }`}
                >
                  {plan.buttonText}
                  {loadingPlan === plan.planKey && (
                    <span className="ml-3 inline-flex items-center" aria-hidden>
                      <span className="w-4 h-4 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" />
                    </span>
                  )}
                </button>

                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
                  <h4 className="font-medium text-base mb-3 text-gray-900 dark:text-white">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 bg-gray-400 dark:bg-neutral-500 rounded-full grid place-content-center"></span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
