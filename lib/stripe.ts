import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const plans = [
  {
    name: "Basic",
    price: 299,
    features: [
      "5 Mock Interviews/month",
      "Basic feedback analysis",
      "Email support",
      "Interview history",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID,
  },
  {
    name: "Professional",
    price: 749,
    features: [
      "15 Mock Interviews/month",
      "Advanced feedback analysis",
      "Priority email support",
      "Interview history",
      "Custom interview scenarios",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
  {
    name: "Enterprise",
    price: 1999,
    features: [
      "Unlimited Mock Interviews",
      "Premium feedback analysis",
      "24/7 Priority support",
      "Interview history",
      "Custom interview scenarios",
      "Team collaboration",
      "API access",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  },
]; 