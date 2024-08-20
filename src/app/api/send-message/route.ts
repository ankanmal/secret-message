import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";


export async function POST(request: Request) {

    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username }).exec();

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User Not Found'
                },
                { status: 404 }
            )
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: 'User Not Accepting Message'
                },
                { status: 403 } //403 forbidden status
            )
        }

        const newMessage = { content, createdAt: new Date() };

        user.messages.push(newMessage as Message)
        user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent Succesfully"
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.log("Error Adding Messages", error);
        return Response.json(
            {
                success: false,
                message: "Internal Server Error,"
            }, {
            status: 500
        }
        )
    }
}