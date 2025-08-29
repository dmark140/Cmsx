"use client";

import AccountInfo from "@/app/account/AccountInfo";
import UserInfo from "@/app/account/UserInfo";
import { Separator } from "@/components/ui/separator";
import React, { useLayoutEffect, useState } from "react";

import { runQuery } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Evaluation from "./Evaluation";
import Image from "next/image";
import logo from "./imgs/image.png"
type LayoutProps = {
  userId: number,
  evaluationId: number
};
type data = {
  DocEntry: number,
  UID: number,
  CreatedBy: number,
  firstname: string,
  MiddleName: string,
  LastName: string,
  createdDate: string
  requestedDate: string
  Title: string
}
export default function Printables({ userId, evaluationId }: LayoutProps) {
  const [schedules, setSchedules] = useState<data[]>([]);


  // const getBookingForEvaluation = async () => {

  //   if (userId === 0) return
  //   const Data = await runQuery("getBookingForEvaluation", [userId]);
  //   console.log(Data)
  //   if (Data) {
  //     setSchedules(Data.data);
  //   }

  // }

  // useLayoutEffect(() => {
  //   getBookingForEvaluation();
  // }, [userId]);

  return (
    <div className="mt-4 p-4 relative z-0 text-sm" style={{ maxHeight: "100vh" }}>
      <Image src={logo}
        className="mx-auto"
        alt=""
        width={500}
        height={500} />
      <h1 className="text-center font-bold my-4"> SOCIAL CASE STUDY REPORT </h1>
      {schedules[0]?.CreatedBy}
      <UserInfo userId={userId} hidePassword={true} />
      <AccountInfo userId={userId} />
      <br />
      <Evaluation evaluationId={evaluationId} />
      {/* <Button onClick={getBookingForEvaluation}>Test</Button> */}
      <div className="flex justify-between    mt-10">
        <div className="w-fit ">
          <div>Noted By</div>
          <div className="border-b border-foreground font-bold uppercase">AUDIEMIER L. ZAYAS, RSW</div>
          <div>DSW</div>
        </div>
        <div className="w-fit text-right ">
          <div>Prepared By</div>
          <div className=" border-b border-foreground font-bold uppercase">GRACE B. NAPONE</div>
          <div>DSW</div>
        </div>
      </div>
    </div>
  );
}
