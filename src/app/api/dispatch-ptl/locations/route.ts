//src/app/api/dispatch-ptl/locations/route.ts

import { NextResponse } from 'next/server'
import { prismaDispatch } from '@/utils/prismaDispatch'

export async function GET() {
  try {

    const locations = await prismaDispatch.location.findMany({
      include: { rack: true },
      orderBy: [
        { rackId: 'asc' },
        { level: 'asc' },
        { position: 'asc' }
      ]
    })

    const activeAwbs = await prismaDispatch.awb.findMany({
      where: { status: 'ASSIGNED' }
    })

    const activeLights = locations.filter(l => l.lightState === 'ON').length

    const assignedCount = await prismaDispatch.awb.count({
      where: { status: 'ASSIGNED' }
    })

    const placedCount = await prismaDispatch.awb.count({
      where: { status: 'PLACED' }
    })

    const formatted = locations.map(loc => {

      const awb = activeAwbs.find(a => a.assignedLocationId === loc.id)

      return {
        id: loc.id,
        rackNumber: loc.rack.rackNumber,
        level: loc.level,
        position: loc.position,
        locationNumber: loc.locationNumber,
        barcode: loc.barcode,
        lightState: loc.lightState,
        currentRoutingCode: loc.currentRoutingCode,
        operatorColor: awb?.operatorColor || null   // ✅ RETURN COLOR
      }
    })

    return NextResponse.json({
      locations: formatted,
      activeLights,
      assignedCount,
      placedCount
    })

  } catch (error) {

    console.error('Locations API Error:', error)

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
