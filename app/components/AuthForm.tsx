'use client'

import Input from "@/components/Input"
import { useCallback, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

type variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
    const [variant, setVariant] = useState<variant>('LOGIN')
    const [isLoading, setIsLoading] = useState(false)

    const toggleVariant = useCallback(() => {
        if(variant==='LOGIN'){
            setVariant('REGISTER')
        }else{
            setVariant('LOGIN')
        }
    }, [variant])

    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        if(variant==='REGISTER'){
            // Axios register
        }
        if(variant==='LOGIN'){
            // NextAuth signin
        }
    }

    const socialAction = (action:string) => {
        setIsLoading(true)
        // nextauth social signin
    }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg px-4 py-8 shadow sm:ronded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <Input label="Email" />
            </form>
        </div>
    </div>
  )
}

export default AuthForm