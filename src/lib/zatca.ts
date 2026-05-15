// ZATCA Phase 2 QR code generation (TLV encoded, Base64)

function tlvEncode(tag: number, value: string): Uint8Array {
  const valueBytes = new TextEncoder().encode(value);
  const result = new Uint8Array(2 + valueBytes.length);
  result[0] = tag;
  result[1] = valueBytes.length;
  result.set(valueBytes, 2);
  return result;
}

export function generateZatcaQRData(params: {
  sellerName: string;
  vatNumber: string;
  invoiceDate: string; // ISO 8601
  totalWithVat: number;
  vatAmount: number;
}): string {
  const { sellerName, vatNumber, invoiceDate, totalWithVat, vatAmount } = params;

  const chunks = [
    tlvEncode(1, sellerName),
    tlvEncode(2, vatNumber),
    tlvEncode(3, invoiceDate),
    tlvEncode(4, totalWithVat.toFixed(2)),
    tlvEncode(5, vatAmount.toFixed(2)),
  ];

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return btoa(String.fromCharCode(...combined));
}

export function formatSAR(amount: number): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export const VAT_RATE = 0.15; // 15% VAT in Saudi Arabia

export function calculateVat(subtotal: number): number {
  return subtotal * VAT_RATE;
}

export function calculateTotal(subtotal: number): number {
  return subtotal + calculateVat(subtotal);
}
