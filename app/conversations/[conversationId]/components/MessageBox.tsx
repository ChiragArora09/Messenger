'use client'

import { WholeMessageType } from "@/app/types"
import Avatar from "@/components/Avatar"
import clsx from "clsx"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import ImageModel from "./ImageModel"

interface MessageBoxProps{
    data: WholeMessageType
    isLast?: boolean
}

const MessageBox:React.FC<MessageBoxProps> = ({data, isLast}) => {
    const session = useSession()
    
    const [imageModelOpen, setImageModelOpen] = useState(false)
    
    const isOur = session?.data?.user?.email === data?.sender?.email
    const seenList = (data.seen || []).filter((user) => user.email !== data?.sender?.email).map((user) => user.name).join(', ')

    const container = clsx("flex gap-3 p-4", isOur && "justify-end")
    const avatar = clsx(isOur && "order-2")
    const body = clsx("flex flex-col gap-2", isOur && "items-end")
    const message = clsx("text-sm w-fit overflow-hidden", isOur ? "bg-[#1D90F5] text-neutral-100": "bg-[#323644]", data.image? 'rounded-md p-0':'rounded-3xl py-2 px-3')

  return (
    <div className={container}>
        <div className={avatar}>
            <Avatar user={data.sender} />
        </div>
        <div className={body}>
            <div className="flex items-center gap-1">
                <div className="text-sm text-gray-400">
                    {data.sender.name},
                </div>
                <div className="text-xs text-gray-500">
                    {format(new Date(data.createdAt), 'p')}
                </div>
            </div>
            <div className={message}>
                <ImageModel src={data.image} isOpen={imageModelOpen} onClose={() => setImageModelOpen(false)} />
                {data.image? (
                    <Image onClick={() => setImageModelOpen(true)} alt="image" height={288} width={288} src={data.image} className="object-cover cursor-pointer hover:scale-105 transition translate" />
                ):(
                    <div>{data.body}</div>
                )}
            </div>
            {isLast && isOur && seenList.length>0 && (
                <div className="text-xs font-light text-gray-400">
                    {`Seen by ${seenList}`}
                </div>
            )}
        </div>
    </div>
  )
}

export default MessageBox