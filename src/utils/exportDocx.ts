// utils/exportDocx.ts
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import type { LOIApiPayload } from "@/types/loi";

/* ---------------- helpers ---------------- */
const safe = (v: unknown) => (v === undefined || v === null ? "" : String(v));
const fmtDate = (d?: string | Date | null) => {
  if (!d) return "";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString();
};
const fileName = (title?: string) =>
  `${(title || "Letter of Intent").trim().replace(/[\\/:*?"<>|]+/g, "_")}.docx`;

// labelize keys: "naturalGas" -> "Natural Gas", "water_sewer" -> "Water Sewer"
const labelize = (s: string) =>
  s
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const isBoolRecord = (val: unknown): val is Record<string, boolean> =>
  !!val &&
  typeof val === "object" &&
  !Array.isArray(val) &&
  Object.values(val as Record<string, unknown>).every((v) => typeof v === "boolean");

const stringifyUtilities = (u: unknown): string => {
  if (!u) return "";
  if (Array.isArray(u)) return u.map(String).join(", ");
  if (typeof u === "string") return u;
  if (isBoolRecord(u)) {
    return Object.entries(u)
      .filter(([, v]) => v)
      .map(([k]) => labelize(k))
      .join(", ");
  }
  return "";
};

/* ---------------- main ---------------- */
export const exportLoiToDocx = async (data: LOIApiPayload) => {
  // rows to render (omit empty)
const rows: Array<[string, string]> = [
  ["Title", safe(data.title)],
  ["Property Address", safe(data.propertyAddress)],
  ["Landlord", safe(data.partyInfo?.landlord_name)],
  ["Tenant", safe(data.partyInfo?.tenant_name)],
  ["Monthly Rent", safe(data.leaseTerms?.monthlyRent)],
  ["Lease Duration", safe(data.leaseTerms?.leaseDuration)],
  ["Start Date", fmtDate(data.leaseTerms?.startDate)],
  ["Utilities", stringifyUtilities(data.propertyDetails?.utilities as unknown)],
  ["Special Conditions", safe(data.additionalDetails?.specialConditions)],
].filter(
  // 👇 keeps tuple type
  (row): row is [string, string] => Boolean(row[1] && row[1].trim().length > 0)
);


  // Header row
  const header = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ text: "Field", heading: HeadingLevel.HEADING_3 })],
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
      }),
      new TableCell({
        children: [new Paragraph({ text: "Value", heading: HeadingLevel.HEADING_3 })],
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
      }),
    ],
    tableHeader: true,
  });

  // Body rows
  const body = rows.map(
    ([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: label + ":", bold: true })] })],
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
          }),
          new TableCell({
            children: value.split("\n").map((line) => new Paragraph({ text: line })),
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
          }),
        ],
      })
  );

  // Explicit widths (twips). ~3000 twips ≈ 2.1", 7800 ≈ 5.4"
  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    columnWidths: [3000, 7800],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
    },
    rows: [header, ...body],
  });

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 }, paragraph: { spacing: { after: 120 } } },
      },
    },
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Letter of Intent", bold: true, size: 48 })],
            spacing: { after: 80 },
          }),
          new Paragraph({
            border: { bottom: { color: "DDDDDD", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { after: 160 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleDateString()}`,
                italics: true,
                color: "6B7280",
                size: 16,
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),

          table,

          new Paragraph({ text: "", spacing: { before: 160, after: 80 } }),
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "This Letter of Intent is a non-binding summary of principal terms for discussion purposes only.",
                italics: true,
                color: "6B7280",
                size: 18,
              }),
            ],
          }),

          new Paragraph({ text: "", spacing: { before: 260 } }),
          new Paragraph({ children: [new TextRun("Tenant Signature: ____________________________")] }),
          new Paragraph({ children: [new TextRun("Date: ____________________")] }),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({ children: [new TextRun("Landlord Signature: __________________________")] }),
          new Paragraph({ children: [new TextRun("Date: ____________________")] }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName(data.title));
};
