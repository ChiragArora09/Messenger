"use client"

import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"

interface GroupChatProps {
    isOpen?: boolean
    onClose: () => void
    users: User[]
}

const GroupChat:React.FC<GroupChatProps> = ({isOpen, onClose, users}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {register, handleSubmit, setValue, watch, formState:{errors}} = useForm<FieldValues>({
        defaultValues: {
            name: "",
            members: []
        }
    })

  return (
    <div>GroupChat</div>
  )
}

export default GroupChat