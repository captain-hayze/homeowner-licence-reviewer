"use client"

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function PrintPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") ?? "";
  const title = searchParams.get("title") ?? "Document";
  const type = searchParams.get("type") ?? "image";

  useEffect(() => {
    document.title = `Print ${title}`;
  }, [title]);

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold">No document URL provided.</h1>
          <p className="mt-2 text-sm text-gray-600">Please open the print page from the document details view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Print Preview</div>
            <div className="text-xs text-gray-500">{title}</div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Print
            </button>
            <button
              type="button"
              onClick={() => window.close()}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] p-4">
        <div className="min-h-[calc(100vh-72px)] overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
          {type === "pdf" ? (
            <iframe
              src={url}
              title={title}
              className="h-[calc(100vh-140px)] w-full"
              style={{ border: "0" }}
            />
          ) : (
            <div className="relative min-h-[calc(100vh-140px)] bg-black">
              <Image
                src={url}
                alt={title}
                fill
                sizes="100vw"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
