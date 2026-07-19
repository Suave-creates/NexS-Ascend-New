import { PrismaClient } from '@/generated/dispatch'

declare global {
  var prismaDispatch: PrismaClient | undefined
}

export const prismaDispatch =
  global.prismaDispatch ||
  new PrismaClient()

global.prismaDispatch = prismaDispatch
