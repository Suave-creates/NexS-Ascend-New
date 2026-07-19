// src/app/api/dispatch-ptl/scan-awb/route.ts

import { NextResponse } from 'next/server'
import type mysql from 'mysql2/promise'
import { nexsPool } from '@/utils/nexsPool'
import { prismaDispatch } from '@/utils/prismaDispatch'
import { sendToRack } from '@/utils/rackController'

export async function POST(req: Request) {
  let conn: mysql.PoolConnection | null = null

  try {
    const { awb, operatorColor } = await req.json()

    if (!awb || !operatorColor) {
      return NextResponse.json(
        { error: 'AWB and operatorColor required' },
        { status: 400 }
      )
    }

    const normalizedColor = operatorColor.toUpperCase()

    /* ==============================
       STEP 1 — FETCH ROUTING FROM WMS
    ============================== */

    conn = await nexsPool.getConnection()
    await conn.changeUser({ database: 'wms' })

    const [rows]: any = await conn.execute(
      `
      SELECT routing_code
      FROM courier_shipment
      WHERE shipping_package_id = ?
      LIMIT 1
      `,
      [awb]
    )

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Routing code not found' },
        { status: 404 }
      )
    }

    const routingCode = rows[0].routing_code

    conn.release()
    conn = null

    /* ==============================
       STEP 2 — PTL TRANSACTION
    ============================== */

    const assignedLocation = await prismaDispatch.$transaction(async (tx) => {

      const location = await tx.location.findFirst({
        where: {
          currentRoutingCode: null,
          isActive: true
        },
        orderBy: { id: 'asc' }
      })

      if (!location) {
        throw new Error('NO_AVAILABLE_LOCATIONS')
      }

      await tx.location.update({
        where: { id: location.id },
        data: {
          currentRoutingCode: routingCode,
          assignmentTimestamp: new Date(),
          lightState: 'ON'
        }
      })

      const existingRouting = await tx.routingAssignment.findUnique({
        where: { routingCode }
      })

      if (existingRouting) {
        await tx.routingAssignment.update({
          where: { routingCode },
          data: {
            locationId: location.id,
            isActive: true,
            assignedAt: new Date(),
            releasedAt: null
          }
        })
      } else {
        await tx.routingAssignment.create({
          data: {
            routingCode,
            locationId: location.id,
            isActive: true,
            assignedAt: new Date()
          }
        })
      }

      await tx.awb.create({
        data: {
          awbNumber: awb,
          routingCode,
          assignedLocationId: location.id,
          operatorColor: normalizedColor,
          status: 'ASSIGNED'
        }
      })

      return location
    })

    /* ==============================
       HARDWARE TRIGGER (AFTER TX)
    ============================== */

    await sendToRack(
      assignedLocation.locationNumber,
      normalizedColor
    )

    return NextResponse.json({
      success: true,
      routingCode,
      location: assignedLocation
    })

  } catch (error: any) {

    if (conn) conn.release()

    if (error.message === 'NO_AVAILABLE_LOCATIONS') {
      return NextResponse.json(
        { error: 'No available PTL locations' },
        { status: 409 }
      )
    }

    console.error('Scan AWB Error:', error)

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}