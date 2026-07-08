// src/app/api/dispatch-ptl/confirm-placement/route.ts

import { NextResponse } from 'next/server'
import { prismaDispatch } from '@/utils/prismaDispatch'
import { sendToRack } from '@/utils/rackController'

export async function POST(req: Request) {
  try {
    const { awb, locationBarcode } = await req.json()

    if (!awb || !locationBarcode) {
      return NextResponse.json(
        { error: 'AWB and location barcode required' },
        { status: 400 }
      )
    }

    const result = await prismaDispatch.$transaction(async (tx) => {

      const awbRecord = await tx.awb.findUnique({
        where: { awbNumber: awb }
      })

      if (!awbRecord) throw new Error('AWB_NOT_FOUND')
      if (awbRecord.status === 'PLACED')
        throw new Error('AWB_ALREADY_PLACED')

      const location = await tx.location.findUnique({
        where: { barcode: locationBarcode }
      })

      if (!location) throw new Error('LOCATION_NOT_FOUND')

      if (awbRecord.assignedLocationId !== location.id)
        throw new Error('LOCATION_MISMATCH')

      const locRouting = location.currentRoutingCode?.trim().toUpperCase()
      const awbRouting = awbRecord.routingCode?.trim().toUpperCase()

      if (!locRouting || !awbRouting || locRouting !== awbRouting)
        throw new Error('ROUTING_MISMATCH')

      await tx.awb.update({
        where: { id: awbRecord.id },
        data: {
          status: 'PLACED',
          placedTimestamp: new Date()
        }
      })

      await tx.location.update({
        where: { id: location.id },
        data: { lightState: 'OFF' }
      })

      await tx.placement.create({
        data: {
          awbId: awbRecord.id,
          locationId: location.id,
          verified: true,
          verifiedAt: new Date()
        }
      })

      await tx.locationEvent.create({
        data: {
          locationId: location.id,
          eventType: 'LIGHT_OFF',
          routingCode: awbRecord.routingCode,
          awbNumber: awb
        }
      })

      return {
        locationNumber: location.locationNumber
      }
    })

    /* ==============================
       HARDWARE OFF TRIGGER
    ============================== */

    await sendToRack(result.locationNumber, "OFF")

    return NextResponse.json({
      success: true,
      message: 'Placement confirmed'
    })

  } catch (error: any) {

    const errorMap: Record<string, number> = {
      AWB_NOT_FOUND: 404,
      LOCATION_NOT_FOUND: 404,
      LOCATION_MISMATCH: 409,
      ROUTING_MISMATCH: 409,
      AWB_ALREADY_PLACED: 409
    }

    if (errorMap[error.message]) {
      return NextResponse.json(
        { error: error.message },
        { status: errorMap[error.message] }
      )
    }

    console.error('Confirm Placement Error:', error)

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}