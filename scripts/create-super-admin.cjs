const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../src/generated/mydb');

const prisma = new PrismaClient();

async function main() {
  const employeeCode = process.env.SUPER_ADMIN_EMPLOYEE_CODE?.trim();
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!employeeCode) {
    throw new Error('Set SUPER_ADMIN_EMPLOYEE_CODE before running this command.');
  }
  if (employeeCode.length > 64) {
    throw new Error('SUPER_ADMIN_EMPLOYEE_CODE must be 64 characters or fewer.');
  }
  const existing = await prisma.user.findUnique({ where: { employeeCode } });
  if (existing) {
    if (existing.role === 'SUPER_ADMIN' && existing.status === 'APPROVED') {
      throw new Error(`Super-admin ${employeeCode} already exists. No data was changed.`);
    }
    await prisma.user.update({
      where: { employeeCode },
      data: { role: 'SUPER_ADMIN', status: 'APPROVED', approvedAt: new Date() },
    });
    console.log(
      `Existing user ${employeeCode} promoted to super-admin; their password was not changed.`,
    );
    return;
  }

  if (!password || password.length < 12) {
    throw new Error(
      'For a new super-admin, set SUPER_ADMIN_PASSWORD to at least 12 characters.',
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      employeeCode,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'APPROVED',
      approvedAt: new Date(),
    },
  });

  console.log(`Super-admin ${employeeCode} created successfully.`);
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
