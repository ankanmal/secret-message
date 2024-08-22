import {z} from "zod"

export const messageSchema= z.object({
    content: z
        .string()
        .min(10,{message:"Content must be 10 characters long"})
        .max(300,{message:"Message Too long should be under 300 characters"})
})