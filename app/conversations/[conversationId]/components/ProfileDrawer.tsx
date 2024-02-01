'use client'

import useOtherUser from "@/app/hooks/useOtherUser"
import { Conversation, User } from "@prisma/client"
import { format } from "date-fns"
import { Fragment, useMemo, useState } from "react"
import { Dialog, Transition } from '@headlessui/react'
import { MdClose, MdDelete } from "react-icons/md"
import Avatar from "@/components/Avatar"
import ConfirmModel from "./ConfirmModel"
import AvatarGroup from "@/components/AvatarGroup"

interface ProfileDrawerProps {
    isOpen: boolean
    onClose: () => void
    data: Conversation & {
        users: User[]
    }
}

const ProfileDrawer:React.FC<ProfileDrawerProps> = ({isOpen, onClose, data}) => {
    const otherUser = useOtherUser(data)

    const [confirmOpen, setConfirmOpen] = useState(false)
    
    const joinedDate = useMemo(() => {
        return format(new Date(otherUser.createdAt), 'PP')
    }, [otherUser.createdAt])

    const title = useMemo(() => {
        return data.name || otherUser.name
    }, [data.name, otherUser.name])

    const statusText = useMemo(() => {
        if(data.isGroup){
            return `${data.users.length} members`
        }

        return 'Active'
    }, [data])

  return (
    <>
        <ConfirmModel isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} />
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className='relative z-50' onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-500" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500" leaveTo="translate-x-full">
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-hidden bg-[#1e1e1e] py-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-end">
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button type="button" className="rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700" onClick={onClose}>
                                                        <span className="sr-only">Close panel</span>
                                                        <MdClose size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="flex flex-col items-center">
                                                <div className="mb-2">
                                                    {data.isGroup ? (
                                                        <AvatarGroup users={data.users} />
                                                    ):(
                                                        <Avatar user={otherUser} />
                                                    )}
                                                </div>
                                                <div>{title}</div>
                                                <div className="text-sm text-green-400">{statusText}</div>
                                                <div className="w-full mt-8 pb-5 pt-5 sm:px-0 sm:pt-0">
                                                    <dl className="border-y border-gray-700 space-y-8 py-8 px-4 sm:space-y-6 sm:px-6">
                                                        {data.isGroup && (
                                                            <div>
                                                                <dt className="text-xl font-medium text-gray-200 sm:w-40 sm:flex-shrink-0">Emails</dt>
                                                                <dd className="mt-1 text-sm text-gray-400 sm:col-span-2">
                                                                    {data.users.map((user) => `${user.name} (${user.email})`).join(' | ')}
                                                                </dd>
                                                            </div>
                                                        )}
                                                        {!data.isGroup && (
                                                            <div className="px-8">
                                                                <dt className="text-sm font-medium text-gray-200 sm:w-40 sm:flex-shrink-0">Email</dt>
                                                                <dd className="mt-1 text-sm text-gray-500 sm:col-span-2">{otherUser.email}</dd>
                                                            </div>
                                                        )}
                                                        {!data.isGroup && (
                                                            <>
                                                            <div className="px-8">
                                                                <dt className="text-sm font-medium text-gray-200 sm:w-40 sm:flex-shrink-0">Joined</dt>
                                                                <dd className="mt-1 text-sm text-gray-500 sm:col-span-2"><time dateTime={joinedDate}>{joinedDate}</time></dd>
                                                            </div>
                                                            </>
                                                        )}
                                                    </dl>
                                                </div>
                                                <div className="flex gap-10 my-8">
                                                    <div onClick={() => setConfirmOpen(true)} className="flex gap-3 items-center justify-center cursor-pointer hover:opacity-75 bg-[#272525] w-64 py-1 rounded-full">
                                                        <div className="w-10 h-10 text-red-500 flex items-center justify-center rounded-full bg-[#2d2c2c]"><MdDelete size={30}/></div>
                                                        <div className="text-sm font-light text-neutral-300">Delete all chats</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    </>
  )
}

export default ProfileDrawer