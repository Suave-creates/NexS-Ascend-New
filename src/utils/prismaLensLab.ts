//utils/prismaLensLab.ts

import { PrismaClient } from '@/generated/lens_lab'

declare global {
  var prismaLensLab: PrismaClient | undefined
}

export const prismaLensLab =
  global.prismaLensLab ||
  new PrismaClient()

global.prismaLensLab = prismaLensLab


