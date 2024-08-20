// yaha pe mostly major kam hai mongodb aggregation ka, jaha pe pehle mujhe 2chizo ka khayal rakhna hoga 1st hai jo user._id hai usko 
// mongoose.types.ObjectId me convert karke fir us userId to uske karke aggragtion method use karna hoga.


import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function GET(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions);
    // @ts-ignore
    const _user: User = session?.user;

    if (!session || !_user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            }, {
            status: 401
        }
        )
    }

    const userId = new mongoose.Types.ObjectId(_user._id);

    console.log(userId);


    try {

        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        console.log("from api/get-messages", user[0].messages);


        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: 'User Not Found'
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                messages: user[0].messages

            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Error Getting Messages", error);
        return Response.json(
            {
                success: false,
                message: "Error Getting Messages: Internal Server Error"
            }, {
            status: 500
        }
        )
    }
}