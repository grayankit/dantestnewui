
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// HANDLES ACCESS TOKEN FOR ANILIST USERS
export async function POST(request: NextRequest) {
    try {
        const anilistTokenData = await request.json();

        if (!anilistTokenData?.accessToken || !anilistTokenData?.tokenType) {
            return new NextResponse(
                JSON.stringify({ message: "No Token Received" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // ✅ Fix: Remove 'await' from cookies()

        (await cookies()).set({
            name: 'access_token',
            value: JSON.stringify(anilistTokenData) || "",
            httpOnly: true,
        })

        return new NextResponse(
            JSON.stringify({ message: "Anilist Token Set!" }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );

    } catch (err) {
        return new NextResponse(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}

export async function GET(request: NextRequest) {

    try {

        const anilistAccessTokenData = request.cookies.get("access_token") ?
            JSON.parse(request.cookies.get("access_token")!.value).accessToken : null

        if (anilistAccessTokenData) {
            return NextResponse.json({
                "message": "Success",
                "access_token": anilistAccessTokenData
            }, {
                status: 200
            })
        }

        return NextResponse.json({
            "message": "No Cookie Found"
        }, {
            status: 404
        })

    }
    catch (err) {

        return NextResponse.json({
            "message": err
        }, {
            status: 500
        })

    }
}

export async function DELETE() {

    try {

        (await cookies()).delete("access_token")

        return NextResponse.json({
            "message": "Success"
        }, {
            status: 202
        })

    }
    catch (err) {

        return NextResponse.json({
            "message": err
        }, {
            status: 500
        })

    }
}
