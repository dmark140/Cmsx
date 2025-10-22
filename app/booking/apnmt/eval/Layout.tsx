"use client";
import AccountInfo from "@/app/account/AccountInfo";
import UserInfo from "@/app/account/UserInfo";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React, { useLayoutEffect, useState } from "react";
import { toast } from "sonner";
import { useGlobalContext } from "@/context/GlobalContext";
import Exporter from "@/app/tools/Exporter";
import Evaluation from "./Evaluation";
import { runQuery } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type data = {
  CreatedBy: number,
  FirstName: string,
  MiddleName: string,
  LastName: string,
}

export default function Layout() {

  const { ID, EvaluationId } = useGlobalContext();
  const [schedules, setSchedules] = useState<data[]>([]);
  const getBookingForEvaluation = async () => {
    if (EvaluationId === 0) return
    const Data = await runQuery("getBookingForEvaluation", [EvaluationId]);
    console.log({ Data })
    console.log(Data.data[0].CreatedBy)
    if (Data) {
      setSchedules(Data.data);
    }
  }

  useLayoutEffect(() => {
    getBookingForEvaluation();
  }, [EvaluationId]);

  return (
    <div className="p-4  ">
      {/* <Button onClick={() => console.log({ schedules, EvaluationId })} >log schedules</Button> */}
      {/* <Button onClick={getBookingForEvaluation} >log schedules</Button> */}

      <div className="text-xl font-semibold">
        Evaluation
      </div>
        <Separator className="mt-2"/>

      <div className="mb-4">
        <div className='my-4'>
          <UserInfo userId={schedules[0]?.CreatedBy} hidePassword={true} />
        </div>
        <Separator />
        <div>
          <AccountInfo userId={schedules[0]?.CreatedBy} />
        </div>
      </div>
      <Separator />
      <Evaluation  />
    </div >
  );
}
