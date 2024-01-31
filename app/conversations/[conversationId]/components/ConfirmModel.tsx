"use client"

import useConversation from "@/app/hooks/useConversation"
import Modal from "@/components/Modal"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { GoAlert } from "react-icons/go"
import { Dialog } from "@headlessui/react"
import Button from "@/components/Button"

interface ConfirmModelProps {
    isOpen?: boolean
    onClose: () => void
}

const ConfirmModel:React.FC<ConfirmModelProps> = ({isOpen, onClose}) => {
    const router = useRouter()
    const {conversationId} = useConversation()
    const [isLoading, setIsLoading] = useState(false)

    const onDelete = useCallback(() => {
        setIsLoading(true)
        axios.delete(`/api/conversation/${conversationId}`)
        .then(() => {
            onClose()
            router.push('/conversations')
        })
        .catch(() => toast.error('Something went wrong'))
        .finally(() => setIsLoading(false))
    }, [conversationId, router, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="sm:flex sm:items-start p-5">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center rounded-full sm:mx-0 sm:h-10 sm:w-10"><GoAlert className="h-8 w-8 text-red-600" /></div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <Dialog.Title as="h3" className="text-base font-semibold leading-6 pt-[9px] text-gray-300">
                    Confirm deletion!!!
                </Dialog.Title>
                <div className="mt-2">
                    <p className="text-[12px] text-gray-400">Are you sure you want to delete this conversation?</p>
                </div>
            </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <Button disabled={isLoading} danger={true} onClick={onDelete}>Delete</Button>
        </div>
    </Modal>
  )
}

export default ConfirmModel