'use client'

import useConversation from "@/app/hooks/useConversation"
import { WholeConversationType } from "@/app/types"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { MdOutlinePersonAdd } from "react-icons/md"
import ConversationBox from "./ConversationBox"
import GroupChat from "./GroupChat"
import { User } from "@prisma/client"
import { useSession } from "next-auth/react"
import { pusherClient } from "@/app/libs/pusher"
import { find } from "lodash"

interface ConversationListProps {
    initialItems: WholeConversationType[]
    users: User[]
}

const ConversationList: React.FC<ConversationListProps> = ({initialItems, users}) => {
    const session = useSession()
    const [items, setItems] = useState(initialItems)
    const [isModelOpen, setIsModelOpen] = useState(false)
    const router = useRouter()
    const {conversationId, isOpen} = useConversation()

    const pusherKey = useMemo(() => {
        return session.data?.user?.email
    }, [session.data?.user?.email])

    useEffect(() => {
        if(!pusherKey){
            return
        }
        pusherClient.subscribe(pusherKey)
        
        const newHandler = (conversation:WholeConversationType) => {
            setItems((current) => {
                if(find(current, {id: conversationId})){
                    return current
                }
                return [conversation, ...current]
            })
        }

        const updateHandler = (conversation:WholeConversationType) => {
            setItems((current) => current.map((currentConversation) => {
                if(currentConversation.id === conversation.id){
                    return {
                        ...currentConversation,
                        messages: conversation.messages
                    }
                }
                return currentConversation
            }))
        }

        const removeHandler = (conversation:WholeConversationType) => {
            setItems((current) => {
              return [...current.filter((convo) => convo.id !== conversation.id)]
            })
            if(conversationId === conversation.id){
                router.push('/conversations')
            }
          }

        pusherClient.bind('conversation:new', newHandler)
        pusherClient.bind('conversation:update', updateHandler)
        pusherClient.bind('conversation:remove', removeHandler)

        return () => {
            pusherClient.unsubscribe(pusherKey)
            pusherClient.unbind('conversation:new', newHandler)
            pusherClient.unbind('conversation:update', updateHandler)
            pusherClient.unbind('conversation:remove', removeHandler)
        }

    }, [pusherKey, conversationId, router])

  return (
    <>
        <GroupChat users={users} isOpen={isModelOpen} onClose={() => setIsModelOpen(false)} />
        <aside className={clsx(`fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-900`, isOpen?'hidden':'block w-full left-0')}>
            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="text-2xl font-bold text-neutral-200">
                        Chats
                    </div>
                    <div className="rounded-full p-2 bg-[#141313] text-neutral-200 cursor-pointer hover:opacity-75 transition">
                        <MdOutlinePersonAdd size={22} onClick={() => setIsModelOpen(true)} />
                    </div>
                </div>
                {items.map((item) => (
                    <ConversationBox key={item.id} data={item} selected={conversationId === item.id}/>
                ))}
            </div>
        </aside>
    </>
  )
}

export default ConversationList