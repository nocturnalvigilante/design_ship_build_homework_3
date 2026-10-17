import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Screen title="There's nothing on this page">
      <p className="text-lg text-muted">Your drinks and sleep time are safe. Head back to Now.</p>
      <div className="mt-auto pt-8">
        <Button href="/" full>
          Back to Now
        </Button>
      </div>
    </Screen>
  );
}
