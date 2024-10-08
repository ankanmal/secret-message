'use client'

import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/sigInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import * as z  from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link";



const Page = () => {

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      username:"",
      password: ""
    }
  })

  const {toast}= useToast();
  const onSubmit= async (data:z.infer<typeof signInSchema>) =>{

  const result =  await signIn('credentials',{
      redirect: false,
      username: data.username,
      password: data.password
    });
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title:'Login Failed',
          description: 'Incorrect credentials',
          variant:"destructive"
        })
      } else {
        toast({
          title:'Error',
          description: result.error,
          variant:"destructive"
        })
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }

  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Welcome Back to Secret Message
        </h1>
        <p className="mb-4">Sign in to continue your secret conversations</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='w-full' type="submit">Sign In</Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Not a member yet?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default Page