"use client";

import { useLayoutEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalContext";
import { toast } from "sonner";
import { useGlobalPush } from "@/lib/router/useGlobalPush";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug; // safe access
  const { ID } = useGlobalContext();
  const { push } = useGlobalPush();

  const hasRedirected = useRef(false);

  useLayoutEffect(() => {
    if (hasRedirected.current) return;

    const noSession = ID === 0 || ID === undefined;
    const isPublicPage = slug === "create_u" || false;
    console.log({ slug })
    // only redirect if slug is defined and it's not a public page
    if (noSession && slug && !isPublicPage) {
      hasRedirected.current = true;
      toast.warning("You have been automatically logged out.");
      push("/");
    }
  }, [ID, slug, push]);

  return <>{children}</>;
}
