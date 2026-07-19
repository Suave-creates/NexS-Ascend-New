//src/app/api/ehs/deviation/[id]/public-edit/route.js
import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

// PATCH - Public edit (only specific fields)
export async function PATCH(req, context) {
  try {
    const data = await req.json();
    const { id } = await context.params;

    const allowedFields = {
      photographAfter: data.photographAfter,
      remarksByDepartment: data.remarksByDepartment,
      complianceStatus: data.complianceStatus,
      complianceDate:
        data.complianceStatus === 'Closed' ? new Date() : undefined,
    };

    const updateData = Object.fromEntries(
      Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
    );

    const deviation = await prisma.eHSDeviation.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(deviation);
  } catch (error) {
    console.error("Public edit deviation error:", error);
    return NextResponse.json(
      { error: "Failed to update deviation" },
      { status: 500 }
    );
  }
}
