"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import Modal from "@/components/Modal"
import Select from "@/components/Select"
import { User } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

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

    const members = watch('members')

    const onSubmit:SubmitHandler<FieldValues> = (data) => {
      setIsLoading(true)
      console.log(data)
      axios.post('/api/conversation', {
        ...data,
        isGroup: true
      })
      .then(() => {
        router.refresh()
        onClose()
      })
      .catch(() => toast.error('Something went wrong'))
      .finally(() => setIsLoading(false))
    }

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="pb-10">
            <h2 className="text-base font-semibold leading-7 text-gray-400">Create a group</h2>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input register={register} label="Name" id="name" disabled={isLoading} required errors={errors} styles="bg-[#2d2b2b]" />
              <Select disabled={isLoading} label="Members" options={users.map((user) => ({
                value: user.id,
                label: user.name
              }))} onChange={(value) => setValue('members', value, {shouldValidate:true})} value={members} />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button disabled={isLoading} type="submit">Create</Button>
        </div>
      </form>
    </Modal>
    </>
  )
}

export default GroupChat