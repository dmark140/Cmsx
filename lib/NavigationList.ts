import { Bell, GitPullRequestCreateIcon, HandHeartIcon, HomeIcon, MegaphoneIcon, Settings2Icon, Shield, ShieldAlert } from "lucide-react";

export const navItems = [
    { id: 0, name: "Dashboard", href: "/", icon: HomeIcon },
    { id: 1, name: "Project Manager", href: "/project", icon: HandHeartIcon },
    { id: 2, name: "Requsts", href: "/request", icon: GitPullRequestCreateIcon },
    { id: 3, name: "Assessment", href: "/ana", icon: GitPullRequestCreateIcon },
    { id: 4, name: "Approvals", href: "/approvals", icon: GitPullRequestCreateIcon },
    { id: 5, name: "qmnger", href: "/qmnger", icon: GitPullRequestCreateIcon },
    { id: -1, name: "User Management", href: "/userrole", icon: Settings2Icon },
    { id: 6, name: "Settings", href: "/settings", icon: Settings2Icon },
    { id: 7, name: "Audit", href: "/audit", icon: ShieldAlert },
    { id: 8, name: "Notifications", href: "/notifs", icon: Bell },
    { id: 9, name: "Fund Entry", href: "/fe", icon: MegaphoneIcon },
]

