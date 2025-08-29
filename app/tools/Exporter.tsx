"use client";

import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type ExporterProps = {
  children: React.ReactNode;
  fileName?: string;
};

export default function Exporter({
  children,
  fileName = "document",
}: ExporterProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const makeAbsolute = () => {
    const el = document.getElementById("mainBox");
    if (el) {
      el.style.position = "absolute";
    }
  };
  const removeAbsolute = () => {
    const el = document.getElementById("mainBox");
    if (el) {
      el.style.position = "static"; // back to normal flow
    }
  };
  const handlePrintsx = () => {
    makeAbsolute()
    handlePrint()
    removeAbsolute()

  }
  const handlePrint = useReactToPrint({
    contentRef: printRef, // ✅ correct for v3+
    documentTitle: fileName,
    pageStyle: `
      @page { size: A4; margin: 12mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  return (
    <Drawer open={open} onOpenChange={setOpen} >
      <DrawerTrigger asChild>
        <Button variant="default">Show Layout</Button>
      </DrawerTrigger>

      <DrawerContent className="p-4 h-full">
        <DrawerHeader>
          <DrawerTitle>Preview</DrawerTitle>
        </DrawerHeader>

        <div ref={printRef} className="overflow-auto " id="mainBox">
          {children}
        </div>

        <div className="flex gap-2 mt-4 ml-auto">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handlePrintsx}>Print</Button>

        </div>
      </DrawerContent>
    </Drawer>
  );
}
