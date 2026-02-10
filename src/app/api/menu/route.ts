// Forces dynamic route
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismaDB";

export async function GET() {
    try {
        const menus = await prisma.mainMenu.findMany({
            orderBy: { order: "asc" },
            include: { children: { orderBy: { order: "asc" } } },
        });

        // Filter root items (items without parentId)
        // The query returns all items, including children who also have their own children populated.
        // However, to construct a pure tree from the root, we might just want to filter in JS or query where parentId is null
        const rootMenus = menus.filter((menu) => !menu.parentId);

        return NextResponse.json(rootMenus);
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, path, parentId, order } = body;

        const newMenu = await prisma.mainMenu.create({
            data: {
                title,
                path,
                parentId: parentId || null,
                order: order || 0,
            },
        });

        return NextResponse.json(newMenu, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
