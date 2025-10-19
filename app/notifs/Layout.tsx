'use client'
import { useGlobalContext } from '@/context/GlobalContext'
import { generateFormattedNumber, onlyDate, runQuery } from '@/lib/utils'
import React, { useEffect, useState } from 'react'


type NotificationType = {
  DocEntry: number;
  created_by: number;
  notif_to_id: number;
  title: string;
  msg: string;
  createdTimeStamp: string;
  isRead: number;
  void: number;
};



export default function Layout() {
  const { ID } = useGlobalContext()
  const [data, setdata] = useState<NotificationType[]>([])
  const [msgs, setMsgs] = useState("**No notification selected**")
  const getNotifs = async () => {
    const data = await runQuery("getNotifById", [ID])
    setdata(data.data)
    console.log({ data })

  }
  useEffect(() => {
    getNotifs()
  }, [ID])
  // const getMsg = () => {
  //   if (!data) return
  // }
  // useEffect(() => {
  //   getMsg()
  // }, [data])



  return (
    <div>
      <div className='text-xl font-semibold'>Notification</div>
      <div className='flex'>
        <div>
          {data?.map((e, i) => (
            <div key={i} className='border-x border-t w-[200px]'>
              <div className={`px-2 border-b relative   cursor-pointer ${e.isRead == 0 && "bg-blue-500/20"}`}
                onClick={async () => {
                  setMsgs(e.msg)
                  try {
                    await runQuery("updateIsRead", [e.DocEntry])
                    console.log({ e })
                  } catch (error) {
                    console.log({ error })
                  }
                }}
              >
                {/* <div className='w-3 h-3 bg-red-500 rounded-full absolute'></div> */}
                <div className='font-semibold '>
                  {e.title}
                </div>
                <div className='dark:text-white/50 text-black/50'>
                  {onlyDate(e.createdTimeStamp)}
                </div>
              </div>
            </div>
          ))}

        </div>

        <div className=' px-4'>
          {msgs}
        </div>
      </div>
    </div>
  )
}
