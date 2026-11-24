type Category = "all" | "donors" | "requests" | "campaigns";

export const FAQS: {
  id: string;
  category: Exclude<Category, "all">;
  q: string;
  a: string;
}[] = [
  {
    id: "free",
    category: "donors",
    q: "Is the platform free to use?",
    a: "Yes. Registering, searching for donors and posting blood requests are completely free. Only campaign contributions involve payments, and they go straight to the campaign.",
  },
  {
    id: "eligible",
    category: "donors",
    q: "Who can become a donor?",
    a: "Anyone who is healthy and eligible under local blood donation guidelines. Create an account, add your blood group and location, and you are ready to be found.",
  },
  {
    id: "contact",
    category: "donors",
    q: "Who can see my contact details?",
    a: "We only share the details needed to coordinate a donation, and only for verified requests. You stay in control of your profile and can update it anytime.",
  },
  {
    id: "verify-request",
    category: "requests",
    q: "How are blood requests verified?",
    a: "Every request is reviewed by an administrator before it is shown to donors. This keeps the platform free of spam and fake emergencies.",
  },
  {
    id: "urgent",
    category: "requests",
    q: "What if my case is urgent?",
    a: "Mark the request as urgent when you create it. Urgent requests are highlighted so donors and admins see them first. Also contact the hospital directly while you wait.",
  },
  {
    id: "verify-campaign",
    category: "campaigns",
    q: "How do fundraising campaigns work?",
    a: "Hospitals and admins create a campaign with a goal amount. After approval it goes live, and anyone can contribute and watch the progress bar fill up.",
  },
  {
    id: "payments",
    category: "campaigns",
    q: "Are payments secure?",
    a: "Yes. Contributions are processed by Stripe, so card details never touch our servers. You get redirected to a secure checkout page to complete the payment.",
  },
];
