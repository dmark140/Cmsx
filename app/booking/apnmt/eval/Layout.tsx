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
    if (Data) {
      setSchedules(Data.data);
    } 
  }

  useLayoutEffect(() => {
    getBookingForEvaluation();
  }, [EvaluationId]);

  return (
    <div className="p-4  ">
      <div className="mb-4">
        <div className='my-4'>
          <UserInfo userId={schedules[0]?.CreatedBy & 0} hidePassword={true} />
        </div>
        <Separator />
        <div>
          <AccountInfo userId={schedules[0]?.CreatedBy & 0} />
        </div>
      </div>
      <Separator />
      <Evaluation />
    </div >
  );
}
