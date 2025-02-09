
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const titleLanguage = body?.titleLanguage;

        if (!titleLanguage) {
            return new NextResponse(
                JSON.stringify({ message: "No Data Received" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // ✅ Fix: Removed 'await' from cookies()
        (await cookies()).set({
            name: 'media_title_language',
            value: titleLanguage
        })

        return new NextResponse(
            JSON.stringify({ message: "Media Title Language Cookie Set!" }),
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

        const mediaTitleLanguage = request.cookies.get("media_title_language")

        if (mediaTitleLanguage) {
            return NextResponse.json({
                "mediaTitleLanguage": mediaTitleLanguage.value
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

        (await cookies()).delete("media_title_language")

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
