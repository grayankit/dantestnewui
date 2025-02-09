import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const isAdultContentEnabled = body.isAdultContentEnabled?.toString(); // Ensure it's a string

        if (!isAdultContentEnabled) {
            return new NextResponse(
                JSON.stringify({ message: "No Data Received" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Correct cookies() usage
        (await cookies()).set({
            name: 'is_adult_content_enabled',
            value: isAdultContentEnabled
        })

        return new NextResponse(
            JSON.stringify({ message: "Adult Content Cookie Set!" }),
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

        const isAdultContentEnabled = request.cookies.get("is_adult_content_enabled")

        if (isAdultContentEnabled) {
            return NextResponse.json({
                "isAdultContentEnabled": isAdultContentEnabled.value
            }, {
                status: 201
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

        (await cookies()).delete("is_adult_content_enabled")

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
