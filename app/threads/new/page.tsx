import { ItoPaperShell } from "@/components/ItoPaperShell";
import { CreateThreadForm } from "@/components/CreateThreadForm";

export default function NewThreadPage() {
  return (
    <ItoPaperShell
      title="Tie a thread"
      subtitle="Choose who this thread is for. Share the invite link after creating it."
      backHref="/threads"
    >
      <CreateThreadForm />
    </ItoPaperShell>
  );
}
