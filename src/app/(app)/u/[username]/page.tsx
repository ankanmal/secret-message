'use client'

import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { messageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';


const page = () => {

    const [questions, setQuestions]= useState<string[]>([])
    const params= useParams<{username: string}>();
    const {toast}= useToast();
    const form=useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues:{
            content:""
        }
    })
    const {setValue}=form;

    const onSubmit = async (data: z.infer<typeof messageSchema>)=>{

        try {
            const response=  await axios.post<ApiResponse>('/api/send-message',{
                username: params.username,
                content: data.content
            })

            if(response.data.success === false){
                toast({
                    title:'Failed',
                    description:response.data.message,
                    variant:'destructive'
                })
            }

            toast({
                title: 'Success',
                description: response.data.message
            })
        } catch (error) {
            const axiosError= error as AxiosError<ApiResponse>;

            toast({
                title:'Failed',
                description: axiosError.response?.data.message ?? 'An Error occured. Please try again',
                variant:'destructive'
            })
        }
      
    }

    const handleExternalUpdate =()=>{
        setValue('content',"updated dynamically")
    }

    const getAiMessages= async()=>{
        const response=await axios.post('/api/suggest-messages')

        console.log(response);
        const sentences= response.data.split("||")
        setQuestions(sentences)
        
    }
    const suggestMessage=(index:number)=>{
        setValue('content',questions[index])
    }
  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Send Secret Message
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Write your message here</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Button type="submit" onClick={handleExternalUpdate}>SetValue</Button>
      <Button type="submit" onClick={getAiMessages}>Get Messages</Button>
    </div>
  </div>
  {questions.map((message, index)=> (
    <Button key={index} onClick={()=>suggestMessage(index)}>{message}</Button>
  ))}
    </>
  )
}

export default page