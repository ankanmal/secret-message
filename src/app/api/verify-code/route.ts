import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";


export async function POST(request: Request) {

    await dbConnect();



    try {

        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username); // it is used for decoding value received in url because in url the value is modified: like space changes to %20
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not Found"
                },
                {
                    status: 404
                }
            )
        }

        const isCodeValid = user.verifyCode === code;

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeNotExpired) {
            if (isCodeValid) {
                user.isVerified = true;
                await user.save();
                return Response.json(
                    {
                        success: true,
                        message: "User Verified Succesfully"
                    },
                    {
                        status: 201
                    }
                )
            } else {
                return Response.json(
                    {
                        success: false,
                        message: "Incorrect Validation Code"
                    },
                    {
                        status: 401
                    }
                )
            }
        } else {
            // Code has expired
            return Response.json(
                {
                    success: false,
                    message:
                        'Verification code has expired. Please sign up again to get a new code.',
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error Verifying User", error);

        return Response.json(
            {
                success: false,
                message: "Error Verifying User"
            },
            {
                status: 500
            }
        )

    }
}