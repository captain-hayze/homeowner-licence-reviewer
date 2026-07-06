"use client"

interface PDFViewerProps {
  url: string;
  className?: string;
}

export default function PDFViewer({ url, className }: PDFViewerProps) {
  return (
    <div className={className ?? "h-full w-full"}>
      <iframe
        src={url}
        title="PDF Viewer"
        className="w-full h-full"
        style={{ border: 0 }}
      />
    </div>
  );
}
