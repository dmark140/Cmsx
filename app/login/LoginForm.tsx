"use client"

import { useState } from "react"
import { CircleSlash, GalleryVerticalEnd, Ghost, MouseIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGlobalContext } from "@/context/GlobalContext"
import { toast } from "sonner"
import lola from "./lola.png";
import Image from "next/image"
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [starded, setstarded] = useState(false)

  const { setUser, settype, setID, setUserLevel } = useGlobalContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userx = email
      console.log({ userx, email, password })
      const res = await fetch("/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryName: "getUserWithPassword",
          params: [userx, email, password],
        }),
      })

      const data = await res.json()
      const userInfo = data?.data?.[0] || 0
      console.log("User Info:", userInfo.DocEntry)

      if (res.ok) {
        if (userInfo.DocEntry) {
          toast("Login successful!")
          console.log({ userInfo })

          setUser(userInfo.user)
          settype(userInfo.type)
          setUserLevel(userInfo.type)
          setID(userInfo.DocEntry)
        } else {
          toast.warning("Wrong email or password.")
        }
      } else {
        toast(data.message || "Login failed")
      }
    } catch (err) {
      console.error("Login error:", err)
      toast("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground p-1 flex size-6 items-center justify-center rounded-md">
              <CircleSlash />
            </div>
            Welfinity.
          </a>
        </div>

        {/* Login Form */}
        {!starded ?
          <div className="grid gap-4 my-auto">
            <div className="text-4xl font-semibold">
              Connecting People to Welfare Anytime, Anywhere.
            </div>
            <div className="text-muted-foreground">
              Where care meets technology ensuring inclusive development at your fingertips.
            </div>
            <div className="ml-auto">
              <Button onClick={() => setstarded(true)}>Get Started</Button>
            </div>
          </div>
          :

          <div className="flex flex-1 items-center justify-center">
            <div className={cn("w-full max-w-xs")}>
              <Card>
                <CardHeader>
                  <CardTitle>Login to your account</CardTitle>
                  <CardDescription>
                    Enter your email below to login to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          {/* <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a> */}
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Logging in..." : "Login"}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <a
                        href="request/create_u"
                        className="underline underline-offset-4"
                      >
                        Sign up
                      </a>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

        }





      </div>

      {/* Right Side Image */}
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={lola}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
        />
      </div>
    </div>
  )
}
