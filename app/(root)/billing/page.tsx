"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { plans, stripePromise } from "@/lib/stripe";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/app/hooks/useAuth";

const BillingPage = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      router.push("/sign-in");
      return;
    }

    try {
      setLoading(planName);
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user.uid,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-8 px-4 -mt-18">
      <h1 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="border rounded-lg p-8 bg-card flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">{plan.name}</h2>
            <p className="text-4xl font-bold mb-6 text-center">
              ₹{plan.price}
              <span className="text-base font-normal text-muted-foreground">
                /month
              </span>
            </p>
            <ul className="mb-8 flex-grow space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full text-lg py-6"
              onClick={() => handleSubscribe(plan.stripePriceId!, plan.name)}
              disabled={loading === plan.name}
            >
              {loading === plan.name ? "Processing..." : "Subscribe Now"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingPage;
