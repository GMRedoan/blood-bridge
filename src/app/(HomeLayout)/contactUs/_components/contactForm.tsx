"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/Reusable/Toast"; // your path

const TOPICS = ["General", "Donating", "Blood request", "Campaigns", "Other"];

interface ContactValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const MAX_MESSAGE = 500;

const ContactForm = () => {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    defaultValues: { name: "", email: "", topic: "General", message: "" },
  });

  const topic = watch("topic");
  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = async () => {
    try {
        Toast({ icon: "success", title: "Message sent successfully" });
      setSent(true);
      reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      Toast({ icon: "error", title: "Could not send your message" });
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-foreground">
          Message sent
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thank you for reaching out. We will reply to your email as soon as we
          can.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSent(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Your name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "At least 2 characters" },
            })}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Topic chips */}
      <div className="space-y-2">
        <Label>What is this about?</Label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((item) => (
            <label
              key={item}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-semibold transition-all has-focus-visible:ring-2 has-focus-visible:ring-primary ${
                topic === item
                  ? "border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <input
                type="radio"
                value={item}
                className="sr-only"
                {...register("topic")}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message">Message</Label>
          <span
            className={`text-xs ${
              messageLength > MAX_MESSAGE
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {messageLength}/{MAX_MESSAGE}
          </span>
        </div>
        <Textarea
          id="message"
          rows={6}
          placeholder="How can we help you?"
          {...register("message", {
            required: "Message is required",
            minLength: { value: 10, message: "At least 10 characters" },
            maxLength: {
              value: MAX_MESSAGE,
              message: `Max ${MAX_MESSAGE} characters`,
            },
          })}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isSubmitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
};

export default ContactForm;
