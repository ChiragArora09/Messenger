'use client'

import useConversation from "@/app/hooks/useConversation"
import { WholeMessageType } from "@/app/types"
import { useRef, useState } from "react"
import MessageBox from "./MessageBox"

interface BodyProps {
  initialMessages: WholeMessageType[]
}


const Body:React.FC<BodyProps> = ({initialMessages}) => {
  const [messages, setMessages] = useState(initialMessages)
  const latestRef = useRef<HTMLDivElement>(null)
  
  const { conversationId } = useConversation()

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