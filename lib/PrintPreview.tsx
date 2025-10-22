"use client";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

type PrintPreviewProps = {
  children: React.ReactNode;
  filename?: string;
};

export function PrintPreview({
  children,
  filename = "report.pdf",
}: PrintPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  function inlineComputedStyles(orig: HTMLElement, clone: HTMLElement) {
    const origNodes = [orig, ...orig.querySelectorAll<HTMLElement>("*")];
    const cloneNodes = [clone, ...clone.querySelectorAll<HTMLElement>("*")];

    origNodes.forEach((node, i) => {
      const cloneNode = cloneNodes[i];
      if (!cloneNode) return;
      const cs = window.getComputedStyle(node);
      cloneNode.setAttribute(
        "style",
        Array.from(cs)
          .map((prop) => `${prop}:${cs.getPropertyValue(prop)};`)
          .join("")
      );

      if (node instanceof HTMLInputElement) {
        (cloneNode as HTMLInputElement).value = node.value;
        if (node.checked) cloneNode.setAttribute("checked", "true");
      }
      if (node instanceof HTMLTextAreaElement) {
        (cloneNode as HTMLTextAreaElement).value = node.value;
        cloneNode.textContent = node.value;
      }
      if (node instanceof HTMLSelectElement) {
        (cloneNode as HTMLSelectElement).value = node.value;
      }
    });
  }

  async function buildPrintableHtml() {
    if (!contentRef.current) return null;
    const clone = contentRef.current.cloneNode(true) as HTMLElement;
    inlineComputedStyles(contentRef.current, clone);

    try {
      const cssResp = await fetch("/globals.css");
      if (cssResp.ok) {
        return `<style>${await cssResp.text()}</style>${clone.outerHTML}`;
      }
    } catch { }
    return clone.outerHTML;
  }

  const handlePrint = async () => {
    const html = await buildPrintableHtml();
    if (!html) return;
    const printJS = (await import("print-js")).default;
    printJS({ printable: html, type: "raw-html", documentTitle: filename.replace(/\.pdf$/, "") });
  };

  const handleDownload = async () => {
    const html = await buildPrintableHtml();
    if (!html) return;
    const printJS = (await import("print-js")).default;
    printJS({ printable: html, type: "raw-html", documentTitle: filename.replace(/\.pdf$/, "") });
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Button onClick={handlePrint} className="ml-auto">Print</Button>
        {/* <Button onClick={handleDownload}>Download</Button> */}
      </div>
      <div
        className="rounded-md w-full"
        style={{
          backgroundColor: "#f3f3f3",
          color: "#000",
          padding: "20px",
        }}
      >
        <div
          className="rounded-md mx-auto"
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            color: "#000",
            maxWidth: "900px",
          }}>
          <div
            ref={contentRef}
            className="rounded-md mx-auto"
            style={{
              backgroundColor: "#fff",
              color: "#000",
              maxWidth: "900px",
            }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
