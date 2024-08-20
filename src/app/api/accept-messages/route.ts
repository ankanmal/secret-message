
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";



export async function POST(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, {
            status: 401
        }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "No Such User Exist"
                }, {
                status: 401
            }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User Message Accepting Status Updated Succesfully"
            }, {
            status: 200
        }
        )


    } catch (error) {
        console.log("Error Updating Message Acceptance Status", error);
        return Response.json(
            {
                success: false,
                message: "Error Updating Message Acceptance Status"
            }, {
            status: 500
        }
        )
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, {
            status: 401
        }
        )
    }



    try {

        const foundUser = await UserModel.findById(user._id);

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User Not Found"
                }, {
                status: 401
            }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            }, {
            status: 200
        }
        )

    } catch (error) {
        console.log("Error Getting User Message Accepting Status", error);
        return Response.json(
            {
                success: false,
                message: "Error Getting User Message Accepting Status"
            }, {
            status: 500
        }
        )
    }
}