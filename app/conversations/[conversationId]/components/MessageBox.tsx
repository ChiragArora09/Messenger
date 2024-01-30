'use client'

import { WholeMessageType } from "@/app/types"
import Avatar from "@/components/Avatar"
import clsx from "clsx"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import Image from "next/image"

interface MessageBoxProps{
    data: WholeMessageType
    isLast?: boolean
}

const MessageBox:React.FC<MessageBoxProps> = ({data, isLast}) => {
    const session = useSession()
    const isOur = session?.data?.user?.email === data?.sender?.email
    const seenList = (data.seen || []).filter((user) => user.email !== data?.sender?.email).map((user) => user.name).join(', ')

    const container = clsx("flex gap-3 p-4", isOur && "justify-end")
    const avatar = clsx(isOur && "order-2")
    const body = clsx("flex flex-col gap-2", isOur && "items-end")
    const message = clsx("text-sm w-fit overflow-hidden", isOur ? "bg-[#1D90F5] text-neutral-100": "bg-[#424656]", data.image? 'rounded-md p-0':'rounded-3xl py-2 px-3')

  return (
    <div className={container}>
        <div className={avatar}>
            <Avatar user={data.sender} />
        </div>
        <div className={body}>
            <div className="flex items-center gap-1">
                <div className="text-sm text-gray-500">
                    {data.sender.name},
                </div>
                <div className="text-xs text-gray-400">
                    {format(new Date(data.createdAt), 'p')}
                </div>
            </div>
            <div className={message}>
                {data.image? (
                    <Image alt="image" height={288} width={288} src={data.image} className="object-cover cursor-pointer hover:scale-105 transition translate" />
                ):(
                    <div>{data.body}</div>
                )}
            </div>
        </div>
    </div>
  )
}

export default MessageBox