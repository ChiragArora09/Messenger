"use client"

import Avatar from "@/components/Avatar"
import { User } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

interface UserBoxProps{
    data: User
} 

const UserBox:React.FC<UserBoxProps> = ({data}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = useCallback(() => {
        setIsLoading(true)
        axios.post('/api/conversation', {userId: data.id})
        .then((data) => {
            router.push(`/conversations/${data.data.id}`)
        })
        .finally(() => setIsLoading(false))
    }, [data, router])

  return (
    <div onClick={handleClick} className="w-full relative flex items-center space-x-3 bg-[#1e1e1e] hover:bg-[#444444] rounded-lg transition cursor-pointer mb-4">
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-200">
                        {data.name}
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserBox