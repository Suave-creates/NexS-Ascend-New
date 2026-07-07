import { NextResponse } from 'next/server'
import { prismaDispatch } from '@/utils/prismaDispatch'

export async function POST() {
  try {

    const result = await prismaDispatch.$transaction(async (tx) => {

      /* ==============================
         1️⃣ Delete Events (child)
      ============================== */
      await tx.locationEvent.deleteMany({})

      /* ==============================
         2️⃣ Delete Placements (child of AWB)
      ============================== */
      await tx.placement.deleteMany({})

      /* ==============================
         3️⃣ Delete AWBs
      ============================== */
      await tx.awb.deleteMany({})

      /* ==============================
         4️⃣ Delete Routing Assignments
      ============================== */
      await tx.routingAssignment.deleteMany({})

      /* ==============================
         5️⃣ Reset Locations
      ============================== */
      const locationReset = await tx.location.updateMany({
        data: {
          currentRoutingCode: null,
          assignmentTimestamp: null,
          lightState: 'OFF'
        }
      })

      return {
        locationsReset: locationReset.count
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Master Reset Completed',
      summary: result
    })

  } catch (error) {

    console.error('Master Reset Error:', error)

    return NextResponse.json(
      { error: 'Master Reset Failed' },
      { status: 500 }
    )
  }
}
