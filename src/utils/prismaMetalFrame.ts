import { PrismaClient } from '@/generated/metal_frame'

declare global {
  var prismaMetalFrame: PrismaClient | undefined
}

export const prismaMetalFrame =
  global.prismaMetalFrame ||
  new PrismaClient()

global.prismaMetalFrame = prismaMetalFrame
