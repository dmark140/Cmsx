"use client";
import AccountInfo from "@/app/account/AccountInfo";
import UserInfo from "@/app/account/UserInfo";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { toast } from "sonner";
import Evaluation from "./Evaluation";


export default function Layout() {


  return (


    <div className="p-4  ">
      <div className="mb-4">
        <div className='my-4'>
          <UserInfo userId={1} hidePassword={true} />
        </div>
        <Separator />
        <div>
          <AccountInfo userId={1} />
        </div>
      </div>
      <Separator />
      <Evaluation />

    </div>
  );
}
