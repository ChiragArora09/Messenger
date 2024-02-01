"use client"

import { User } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Modal from "./Modal"
import Input from "./Input"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"
import Button from "./Button"

interface SettingModelProps {
    isOpen?: boolean
    onClose: () => void
    currentUser: User
}

const SettingModel:React.FC<SettingModelProps> = ({isOpen, onClose, currentUser}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {register, handleSubmit, setValue, watch, formState:{errors}} = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image
        }
    })

    const image = watch('image')

    const handleUpload = (result:any) => {
        setValue('image', result?.info?.secure_url, {
            shouldValidate: true
        })
    }

    const onSubmit:SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        axios.post('/api/settings', data)
        .then(() => {
            router.refresh()
            onClose()
        })
        .catch(() => toast.error('Something went wrong'))
        .finally(() => setIsLoading(false))
    }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
                <div className="pb-6">
                    <h2 className="text-base font-semibold leading-7 text-gray-300">
                        Edit your Profile
                    </h2>
                    <div className="mt-7 flex items-end justify-between">
                    <Input disabled={isLoading} label="Name" id="name" errors={errors} required register={register} styles="bg-[#2d2b2b] text-gray-300 py-1 pr-24 mb-2 rounded-xl" />
                        <div>
                            <div className="mt-1 flex flex-col items-center gap-x-3">
                                <Image width={48} height={48} className="h-16 w-16 rounded-full" src={image || currentUser?.image || "/placeholder.jpg"} alt="Avatar" />
                                <CldUploadButton options={{maxFiles:1}} onUpload={handleUpload} uploadPreset="o6oflvep">
                                    <Button disabled={isLoading} secondary type="button"><p className="text-gray-300 border border-gray-500 px-4 py-1 rounded-xl">Change</p></Button>
                                </CldUploadButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-x-3">
                    <Button disabled={isLoading} secondary onClick={onClose}>
                        <p className="text-gray-300">Cancel</p>
                    </Button>
                    <Button disabled={isLoading} type="submit">
                        Save
                    </Button>
                </div>
            </div>
        </form>
    </Modal>
  )
}

export default SettingModel