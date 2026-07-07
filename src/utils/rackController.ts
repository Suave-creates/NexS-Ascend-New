// src/utils/rackController.ts

const rackIPs: Record<number, string> = {
  1: "http://10.9.97.101",
  2: "http://192.168.1.102",
  3: "http://192.168.1.103",
  4: "http://192.168.1.104"
}

// 15 positions per rack (adjust if needed)
const POSITIONS_PER_RACK = 15

export async function sendToRack(
  locationNumber: number,
  color: string
) {
  const rack = Math.ceil(locationNumber / POSITIONS_PER_RACK)
  const ip = rackIPs[rack]

  if (!ip) {
    console.error(`No rack configured for location ${locationNumber}`)
    return
  }

  try {
    await fetch(`${ip}/light`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationNumber,
        color
      })
    })
  } catch (error) {
    console.error(`Rack ${rack} unreachable`, error)
  }
}