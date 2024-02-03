'use client'

import useConversation from "@/app/hooks/useConversation"
import { WholeMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import { pusherClient } from "@/app/libs/pusher"
import { find } from "lodash"

interface BodyProps {
  initialMessages: WholeMessageType[]
}


const Body:React.FC<BodyProps> = ({initialMessages}) => {
  const [messages, setMessages] = useState(initialMessages)
  const latestRef = useRef<HTMLDivElement>(null)
  
  const { conversationId } = useConversation()

  useEffect(() => {
    axios.post(`/api/conversation/${conversationId}/seen`)
  }, [conversationId])
  
  useEffect(() => {
    pusherClient.subscribe(conversationId)
    latestRef?.current?.scrollIntoView()

    const messageHandler = (message:WholeMessageType) => {
      axios.post(`/api/conversation/${conversationId}/seen`)
      setMessages((current) => {
        if(find(current, {id: message.id})){
          return current
        }
        return [...current, message]
      })
      latestRef?.current?.scrollIntoView()
    }

    const updateMessageHandler = (newMessage:WholeMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if(currentMessage.id === newMessage.id){
          return newMessage
        }
        return currentMessage
      }))
    }

    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('messages:update', updateMessageHandler)
    }
  }, [conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox key={message.id} data={message} isLast={i===messages.length-1} />
      ))}
      <div ref={latestRef} className="pt-24" />
    </div>
  )
}

export default Body