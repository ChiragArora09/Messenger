'use client'

import useOtherUser from "@/app/hooks/useOtherUser"
import Avatar from "@/components/Avatar"
import { Conversation, User } from "@prisma/client"
import Link from "next/link"
import { useMemo } from "react"
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2"

// interface HeaderProps {
//     conversation: Conversation & {
//         users: User[]
//     }
// }

type HeaderProps = {
    conversation: Conversation & {
        users: User[]
    }
}

const Header:React.FC<HeaderProps> = ({conversation}) => {
    const otherUser = useOtherUser(conversation)

    const statusText = useMemo(() => {
        if(conversation.isGroup){
            return `${conversation.users.length} members`
        }
        return 'Online'
    }, [conversation])

  return (
    <div className="bg-[#1e1e1e] w-full flex border-b-[1px] border-gray-800 sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
            <Link href='/conversations' className="lg:hidden block text-gray-300 hover:text-gray-100 transition cursor-pointer">
                <HiChevronLeft size={32} />
            </Link>
            <Avatar user={otherUser} />
            <div className="flex flex-col">
                <div className="text-gray-100">
                    {conversation.name || otherUser.name}
                </div>
                <div className="text-xs font-light text-neutral-300">{statusText}</div>
            </div>
        </div>
        <HiEllipsisHorizontal size={32} onClick={() => {}} className="cursor-pointer" />
    </div>
  )
}

export default Header