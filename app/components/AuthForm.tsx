'use client'

import Button from "@/components/Button"
import Input from "@/components/Input"
import { useCallback, useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import AuthSocialButtons from "./AuthSocialButtons"
import { BsGithub, BsGoogle } from "react-icons/bs"
import axios from "axios"
import toast from "react-hot-toast"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
    const [variant, setVariant] = useState<variant>('LOGIN')
    const [isLoading, setIsLoading] = useState(false)
    
    const session = useSession()
    const router = useRouter()

    useEffect(() => {
      if(session?.status === "authenticated"){
        router.push('/users')
      }
    }, [session?.status, router])

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
        setIsLoading(true);
        if (variant === 'REGISTER') {
          axios.post('/api/register', data)
          .then(() => signIn('credentials', {
            ...data,
            redirect: false,
          }))
          // .then((callback) => {
          //   if (callback?.error) {
          //     toast.error('Invalid credentials!');
          //   }
          //   if (callback?.ok) {
          //     toast.success('SUCCESS')
          //   }
          // })
          .catch(() => toast.error('Something went wrong!'))
          .finally(() => setIsLoading(false))
        }
        if (variant === 'LOGIN') {
          signIn('credentials', {
            ...data,
            redirect: false
          })
          .then((callback) => {
            if (callback?.error) {
              toast.error('Invalid credentials!');
            }
            if (callback?.ok) {
              toast.success("Logged in")
              router.push('/users')
            }
          })
          .finally(() => setIsLoading(false))
        }
      }
    
      const socialAction = (action: string) => {
        setIsLoading(true);
        signIn(action, { redirect: false })
          .then((callback) => {
            if (callback?.error) {
              toast.error('Invalid credentials!');
            }
            if (callback?.ok && !callback?.error) {
                toast.success('Success');
            }
          })
          .finally(() => setIsLoading(false));
      } 

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-400 bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg px-4 py-8 shadow sm:ronded-lg sm:px-10">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
                {variant === 'REGISTER' && (
                    <Input id="name" label="Name" register={register} errors={errors} disabled={isLoading} styles="text-gray-900" />
                )}
                <Input id="email" label="Email" type="email" register={register} errors={errors} disabled={isLoading} styles="text-gray-900" />
                <Input id="password" label="Password" type="password" register={register} errors={errors} disabled={isLoading} styles="text-gray-900" />
                <div className="mt-8">
                    <Button disabled={isLoading} fullWidth type="submit">{variant==='LOGIN'?'Sign in':'Sign up'}</Button>
                </div>
            </form>
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-400"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-gray-600 rounded-full px-4 text-xs text-gray-200">Or continue with</span>
                    </div>
                </div>
                <div className="mt-6 flex gap-2">
                    <AuthSocialButtons icon={BsGoogle} onClick={() => socialAction('google')} />
                    <AuthSocialButtons icon={BsGithub} onClick={() => socialAction('github')} />
                </div>
            </div>
            <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                <div>
                    {variant === 'LOGIN' ? "Don't have an account?" : 'Already have an account?'}
                </div>
                <div onClick={toggleVariant} className="underline cursor-pointer text-sky-500">{variant==='LOGIN'?'Sign Up':'Sign in'}</div>
            </div>
        </div>
    </div>
  )
}

export default AuthForm