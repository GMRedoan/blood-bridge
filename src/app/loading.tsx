import BloodLoader from "@/components/Reusable/loader";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative isolate flex min-h-[80vh] flex-col items-center justify-center overflow-hidden"
    >
      <div>
        <BloodLoader/>
      </div>
      <p className="mt-8 text-xl text-muted-foreground">
        Getting things ready ...
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
