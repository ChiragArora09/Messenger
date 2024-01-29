'use client'

import useConversation from "@/app/hooks/useConversation"
import axios from "axios"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { HiPhoto } from "react-icons/hi2"
import MessageInput from "./MessageInput"
import { HiPaperAirplane } from "react-icons/hi2"

const TextForm = () => {
    const { conversationId } = useConversation()

    const {register, handleSubmit, setValue, formState:{errors}} = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', {shouldValidate: true})
        axios.post('/api/messages', {
            ...data,
            conversationId
        })
    }

  return (
    <div className="px-4 py-5 bg-[#1e1e1e] flex items-center gap-2 lg:gap-4 w-full">
        <HiPhoto size={30} className="text-sky-100" />
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
            <MessageInput id="message" register={register} errors={errors} required placeholder="Type a message" />
            <button type="submit" className="text-white rounded-full bg-[#444141] p-2 cursor-pointer"><HiPaperAirplane size={18} className="text-white" /></button>
        </form>
    </div>
  )
}

export default TextForm