import { Button } from "@heroui/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Personal Finance</h1>
        <p className="text-default-500 text-sm">
          Mobile-first personal finance application. System scaffolding ready.
        </p>
        <div className="pt-4 flex justify-center">
          <Button variant="primary">
            Sẵn sàng phát triển
          </Button>
        </div>
      </div>
    </main>
  );
}
