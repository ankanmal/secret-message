import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const usernameValidateSchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect();

    try {

        const { searchParams } = new URL(request.url);

        const queryParams = {
            username: searchParams.get('username')
        }

        const result = usernameValidateSchema.safeParse(queryParams)

        //console.log(result.error); // ToDo: remove later

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid Parameters'
                },
                { status: 401 }
            )
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {

            return Response.json(
                {
                    success: false,
                    message: "Username Already Taken"
                },
                {
                    status: 200
                }
            )

        }

        return Response.json(
            {
                success: true,
                message: 'Username is unique',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Username Validation Failed", error);

        return Response.json(
            {
                success: false,
                message: "Username Validation Error"
            },
            {
                status: 500
            }
        )

    }

}