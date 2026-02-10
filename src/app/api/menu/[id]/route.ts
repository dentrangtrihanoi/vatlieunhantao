
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(req: NextRequest, context: Context) {
    try {
        const { id } = await context.params;

        await prisma.mainMenu.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Menu item deleted" }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, context: Context) {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const { title, path, parentId, order } = body;

        const updatedMenu = await prisma.mainMenu.update({
            where: { id },
            data: {
                title,
                path,
                parentId: parentId || null,
                order,
            },
        });

        return NextResponse.json(updatedMenu, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
