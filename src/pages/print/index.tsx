import { Suspense } from "react";
import PrintPageClient from "./PrintPageClient";

export default function PrintPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading print preview...</div>}>
      <PrintPageClient />
    </Suspense>
  );
}
