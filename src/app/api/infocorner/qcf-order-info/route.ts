import { NextResponse } from 'next/server';
import { BIGQUERY_DATA_PROJECT_ID, runBigQuery } from '@/utils/resources/bigquery/client';

export async function POST(req: Request) {
  try {
    const { shippingPackageId } = await req.json();

    if (!shippingPackageId || typeof shippingPackageId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing shippingPackageId' },
        { status: 400 }
      );
    }

    const { rows } = await runBigQuery(
      `
      SELECT 
        shipping_package_id,
        barcode,
        qc_fail_count,
        reason_name,
        status,
        updated_by,
        FORMAT_TIMESTAMP('%F %T', updated_at) AS updated_at
      FROM \`${BIGQUERY_DATA_PROJECT_ID}.orderqc.qc_status_history\`
      WHERE CAST(shipping_package_id AS STRING) = @shipping_package_id
      ORDER BY updated_at DESC
      `,
      10000,
      { shipping_package_id: shippingPackageId },
    );

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error: any) {
    console.error('QC History API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
