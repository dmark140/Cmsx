"use client";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppWindow, Briefcase, GitPullRequestCreateIcon, Loader2Icon, ProjectorIcon, QuoteIcon, SettingsIcon, User } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContext";
import { ModeToggle } from "../ModeToggle";

export function SiteHeader() {
  const { loading } = useGlobalContext()
  const pathname = usePathname(); // e.g. "/project"
  const pathSegments = pathname.split("/").filter(Boolean); // ["project"]
  console.log("Path segments:", pathSegments);
  const currentPage = pathSegments[0]; // "project"

  const LinkList = [
    {
      name: "Froms",
      href: "project",
      icon: AppWindow
    },
    {
      name: "Finance",
      href: "finance",
      icon: Briefcase
    },
    {
      name: "Request",
      href: "request",
      icon: GitPullRequestCreateIcon
    },
    {
      name: "Settings",
      href: "settings",
      icon: SettingsIcon
    },
    {
      name: "Approvals",
      href: "approvals",
      icon: QuoteIcon
    },


    {
      name: "Account",
      href: "account",
      icon: User
    }
  ]
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {loading ?
            LinkList.map((link) => (
              currentPage === link.href ?
                <p key={link.name} className="flex items-center gap-2 ">
                  <link.icon />
                  {link.name}
                </p>
                : ""
            ))
            :
            <div className="items-center flex  justify-center gap-2">
              {/* <Loader2Icon className="animate-spin" />Loading */}
            </div>
          }


        </h1>

      </div>
      <div className="mx-4">
        <ModeToggle />
      </div>
    </header>
  )
}
