// utils/exportDocx.ts
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  ImageRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  AlignmentType,
  VerticalAlign,
  WidthType,
  BorderStyle,
  TableLayoutType,
  NumberFormat,
  TabStopType
} from 'docx';
import { saveAs } from "file-saver";
import type { LOIApiPayload } from "@/types/loi";

/* ---------------- helpers ---------------- */
// const safe = (v: unknown) => (v === undefined || v === null ? "" : String(v));
// const fmtDate = (d?: string | Date | null) => {
//   if (!d) return "";
//   const dt = new Date(d);
//   return Number.isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString();
// };
// const fileName = (title?: string) =>
//   `${(title || "Letter of Intent").trim().replace(/[\\/:*?"<>|]+/g, "_")}.docx`;

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

// Helper function to load logo from public directory
const loadLogo = async (): Promise<string | undefined> => {
  try {
    const response = await fetch('/logo.png');
    if (!response.ok) return undefined;
    
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Could not load logo:', error);
    return undefined;
  }
};

// export const exportLoiToDocx = async (data: LOIApiPayload, logoBase64?: string) => {
//   // Load logo if not provided
//   if (!logoBase64) {
//     logoBase64 = await loadLogo();
//   }
//   const companyName = "The Retail Connection";

//   const bodyParagraph = (text: string, opts: Partial<Paragraph> = {}) =>
//     new Paragraph({
//       children: [new TextRun({ text, font: "Times New Roman", size: 22 })],
//       spacing: { after: 120 },
//       ...opts,
//     });

//   // ---------- helpers for clean 2-col "Details" table ----------
//   const v = (runs: (TextRun | string)[], opts: Partial<Paragraph> = {}) =>
//     new Paragraph({
//       children: runs.map(r => (typeof r === "string" ? new TextRun({ text: r, font: "Times New Roman", size: 22 }) : r)),
//       spacing: { after: 0 },
//       ...opts,
//     });

//   const strong = (t: string) => new TextRun({ text: t, bold: true, font: "Times New Roman", size: 22 });
//   const u = (t: string) => new TextRun({ text: t, underline: {}, font: "Times New Roman", size: 22 });
//   const linkText = (display: string) => new TextRun({ 
//     text: display, 
//     font: "Times New Roman", 
//     size: 22,
//     color: "0000FF", 
//     underline: {} 
//   });

//   const detailRow = (label: string, valueParagraphs: Paragraph[]) =>
//     new TableRow({
//       children: [
//         new TableCell({
//           // Increased margins for better spacing
//           margins: { top: 150, bottom: 150, left: 0, right: 250 },
//           width: { size: 25, type: WidthType.PERCENTAGE },
//           verticalAlign: VerticalAlign.TOP,
//           children: [
//             new Paragraph({
//               children: [new TextRun({ 
//                 text: `${label}:`, 
//                 bold: true, 
//                 italics: true, 
//                 font: "Times New Roman", 
//                 size: 22 
//               })],
//               spacing: { after: 0 },
//             }),
//           ],
//         }),
//         new TableCell({
//           margins: { top: 150, bottom: 150, left: 0, right: 0 },
//           width: { size: 75, type: WidthType.PERCENTAGE },
//           verticalAlign: VerticalAlign.TOP,
//           children: valueParagraphs,
//         }),
//       ],
//     });

//   // ---------- simple header with logos only ----------
//   const header = new Header({
//     children: [
//       // Logo row - Action Behavior Centers and Swearingen logos
//       new Table({
//         width: { size: 100, type: WidthType.PERCENTAGE },
//         layout: TableLayoutType.FIXED,
//         borders: {
//           top: { style: BorderStyle.NONE, size: 0 },
//           bottom: { style: BorderStyle.NONE, size: 0 },
//           left: { style: BorderStyle.NONE, size: 0 },
//           right: { style: BorderStyle.NONE, size: 0 },
//           insideHorizontal: { style: BorderStyle.NONE, size: 0 },
//           insideVertical: { style: BorderStyle.NONE, size: 0 },
//         },
//         rows: [
//           new TableRow({
//             children: [
//               new TableCell({
//                 width: { size: 50, type: WidthType.PERCENTAGE },
//                 margins: { top: 100, bottom: 100, left: 0, right: 0 },
//                 verticalAlign: VerticalAlign.CENTER,
//                 children: [
//                   new Paragraph({
//                     children: logoBase64 ? [
//                       new ImageRun({
//                         data: logoBase64,
//                         transformation: { width: 150, height: 60 },
//                       })
//                     ] : [new TextRun({ 
//                       text: "Fair", 
//                       font: "Times New Roman", 
//                       size: 18,
//                       bold: true,
//                       color: "4A90E2"
//                     })],
//                     alignment: AlignmentType.LEFT,
//                   }),
//                 ],
//               }),
//               new TableCell({
//                 width: { size: 50, type: WidthType.PERCENTAGE },
//                 margins: { top: 100, bottom: 100, left: 0, right: 0 },
//                 verticalAlign: VerticalAlign.CENTER,
//                 children: [
//                   new Paragraph({
//                     children: [new TextRun({ 
//                       text: "SWEARINGEN REALTY GROUP", 
//                       font: "Times New Roman", 
//                       size: 18,
//                       bold: true,
//                       color: "1E5A96"
//                     })],
//                     alignment: AlignmentType.RIGHT,
//                   }),
//                 ],
//               }),
//             ],
//           }),
//         ],
//       }),
      
//       // Horizontal line separator
//       new Paragraph({
//         children: [new TextRun({ text: "_".repeat(80), font: "Times New Roman", size: 16, color: "CCCCCC" })],
//         alignment: AlignmentType.CENTER,
//         spacing: { before: 200, after: 200 },
//       }),
//     ],
//   });

//   const footer = new Footer({
//     children: [
//       new Paragraph({
//         children: [new TextRun({ 
//           text: "{Execution Page to Follow}", 
//           italics: true, 
//           size: 20,
//           font: "Times New Roman"
//         })],
//         alignment: AlignmentType.CENTER,
//         spacing: { before: 400 },
//       }),
//     ],
//   });

//   // ---------- document ----------
//   const doc = new Document({
//     creator: companyName,
//     sections: [
//       {
//         properties: {
//           // A4 page with proper margins
//           page: {
//             size: { width: 11906, height: 16838 }, // twips
//             margin: { top: 720, bottom: 720, left: 1080, right: 1080 },
//             pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
//           },
//         },
//         headers: { default: header },
//         footers: { default: footer },
//         children: [
//           // Intro/date/contact block at top (now appears only on first page)
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "March 24, 2024", 
//               font: "Times New Roman", 
//               size: 22 
//             })], 
//             spacing: { after: 300 } 
//           }),
          
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "Andrew Sudderth", 
//               bold: true, 
//               font: "Times New Roman", 
//               size: 22 
//             })],
//             spacing: { after: 80 }
//           }),
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "The Retail Connection", 
//               font: "Times New Roman", 
//               size: 22 
//             })],
//             spacing: { after: 80 }
//           }),
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "1000 N Lamar Blvd, Suite 410, Austin, TX 78701", 
//               font: "Times New Roman", 
//               size: 22 
//             })],
//             spacing: { after: 80 }
//           }),
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "(512) 485-0797 X1797 (p)", 
//               font: "Times New Roman", 
//               size: 22 
//             })],
//             spacing: { after: 80 }
//           }),
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "(214) 797-9923 (m)", 
//               font: "Times New Roman", 
//               size: 22 
//             })],
//             spacing: { after: 80 }
//           }),
//           new Paragraph({
//             children: [new TextRun({ 
//               text: "asudderth@theretailconnection.net", 
//               font: "Times New Roman", 
//               size: 22, 
//               color: "0000FF", 
//               underline: {} 
//             })],
//             spacing: { after: 400 },
//           }),

//           // Re: line
//           new Paragraph({
//             children: [
//               new TextRun({ 
//                 text: "Re:", 
//                 bold: true, 
//                 size: 22, 
//                 font: "Times New Roman" 
//               }),
//               new TextRun({ 
//                 text: `\t\t${safe(data.title) || "Proposal for National Behavioral Health Operator 4915 Foster"}`, 
//                 italics: true, 
//                 size: 22, 
//                 font: "Times New Roman" 
//               }),
//             ],
//             spacing: { before: 200, after: 400 },
//             tabStops: [{ type: TabStopType.LEFT, position: 800 }],
//           }),

//           // Greeting
//           new Paragraph({
//             children: [new TextRun({ 
//               text: "Dear Landlord:", 
//               size: 22, 
//               font: "Times New Roman" 
//             })],
//             spacing: { before: 200, after: 300 },
//           }),

//           // Intro paragraph
//           bodyParagraph(
//             "The following is a proposal to lease space at the above building for your review and consideration.", 
//             { spacing: { after: 400 } }
//           ),

//           // -------- CLEAN DETAILS TABLE --------
//           new Table({
//             width: { size: 100, type: WidthType.PERCENTAGE },
//             layout: TableLayoutType.FIXED,
//             // Completely borderless table
//             borders: {
//               top: { style: BorderStyle.NONE, size: 0 },
//               bottom: { style: BorderStyle.NONE, size: 0 },
//               left: { style: BorderStyle.NONE, size: 0 },
//               right: { style: BorderStyle.NONE, size: 0 },
//               insideHorizontal: { style: BorderStyle.NONE, size: 0 },
//               insideVertical: { style: BorderStyle.NONE, size: 0 },
//             },
//             rows: [
//               detailRow("Tenant", [
//                 v([
//                   safe(data.partyInfo?.tenant_name) ||
//                   "ACTION BEHAVIOR CENTERS THERAPY, LLC, a Delaware limited liability company",
//                   " ",
//                   linkText("https://www.actionbehavior.com/locations/"),
//                 ]),
//               ]),
//               detailRow("Trade Name", [
//                 v([
//                   "Action Behavior Center or ABC (Tenant may, without the consent of Landlord, change its Trade Name to the trade name used by a majority of Tenant's locations).",
//                 ]),
//               ]),
//               detailRow("Landlord", [v([safe(data.partyInfo?.landlord_name) || "Riverlake Partners"])]),
//               detailRow("Parcel Number", [v(["Property ID: 11778907"])]),
//               detailRow("Premises Exact Address", [v([safe(data.propertyAddress) || "4915 N Lakeview Dr, San Antonio TX, 78244"])]),
//               detailRow("Premises", [v(["Approximately 7,500 square feet on the west endcap space, Suite # TBD as per ", strong("Exhibit A"), "."])]),
//               detailRow("Outdoor Playground", [
//                 v([
//                   "Landlord to allow Tenant to construct an outdoor play area adjacent Premises as per ",
//                   strong("Exhibit A"),
//                   ", ",
//                   u("subject to Landlord's review and approval of the location and dimensions not to be unreasonably withheld or delayed"),
//                   ". Tenant will provide a plan prior to lease execution.",
//                 ]),
//               ]),
//               detailRow("Term", [v([safe(data.leaseTerms?.leaseDuration) || "Seven (7) years"])]),
//               detailRow("Base Rent", [v([safe(data.leaseTerms?.monthlyRent) || "$38.00 /SF"])]),
//               detailRow("Annual Increases", [v(["Two and a half percent (2.5%) throughout the Base Term and Renewal Options."])]),
//               detailRow("Renewal Option", [v(["Two (2) 5-year options with six (6) months prior notice for each option at 10% increase from previous term."])]),
//               detailRow("Rent Abatement", [v(["One (1) month free Base Rent following the Commencement Date."])]),
//               detailRow("Security Deposit", [v(["None"])]),
//             ],
//           }),

//           // Non-binding clauses
//           bodyParagraph(
//             "This letter is not binding and does not constitute an agreement between the parties, but merely sets forth the general terms under which the Tenant agrees to enter further negotiations and is contingent upon the Tenant's review of a draft lease and a definitive written agreement signed by the parties. Tenant Broker makes no warranty or representation to Landlord or Tenant that the acceptance of the proposal will guarantee the execution of a lease for the Premises.",
//             { spacing: { before: 400, after: 300 } }
//           ),
//           bodyParagraph(
//             "Please review the above lease proposal and provide your comments within seven (7) business days upon receipt. If the above proposal is accepted, we will forward the Lease to you for your review. Please note that the above lease proposal does not bind either party to the terms until the Lease is drawn and executed by both parties.",
//             { spacing: { after: 400 } }
//           ),

//           // Signature block - matching template exactly
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "Sincerely,", 
//               size: 22, 
//               font: "Times New Roman" 
//             })], 
//             spacing: { after: 400 } 
//           }),
          
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "Matthew Paterson", 
//               size: 22, 
//               font: "Times New Roman" 
//             })], 
//             spacing: { after: 80 } 
//           }),
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "Vice President", 
//               size: 22, 
//               font: "Times New Roman" 
//             })], 
//             spacing: { after: 80 } 
//           }),
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "Swearingen Realty Group", 
//               size: 22, 
//               font: "Times New Roman" 
//             })], 
//             spacing: { after: 500 } 
//           }),

//           // Agreement section - exactly matching template
//           new Paragraph({
//             children: [
//               new TextRun({ 
//                 text: "AGREED AND ACCEPTED", 
//                 bold: true, 
//                 size: 22, 
//                 font: "Times New Roman" 
//               }),
//               new TextRun({ 
//                 text: " on this ", 
//                 size: 22, 
//                 font: "Times New Roman" 
//               }),
//               new TextRun({ 
//                 text: "____________", 
//                 underline: {}, 
//                 size: 22, 
//                 font: "Times New Roman" 
//               }),
//               new TextRun({ 
//                 text: ".", 
//                 size: 22, 
//                 font: "Times New Roman" 
//               }),
//             ],
//             spacing: { after: 400 },
//           }),

//           // TENANT section - exactly matching template
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "TENANT", 
//               bold: true, 
//               size: 22, 
//               font: "Times New Roman" 
//             })], 
//             spacing: { after: 200 } 
//           }),
          
//           // "DocuSign Signed by" placeholder text
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "DocuSign Signed by:", 
//               size: 16, 
//               font: "Times New Roman",
//               italics: true,
//               color: "666666"
//             })], 
//             spacing: { after: 80 } 
//           }),
          
//           // Maria Beard signature line
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "Maria Beard", 
//               size: 22, 
//               font: "Times New Roman",
//               underline: {},
//               bold: true
//             })], 
//             spacing: { after: 80 }
//           }),
          
//           new Paragraph({ 
//             children: [
//               new TextRun({ text: "By: ", size: 22, font: "Times New Roman" }),
//               new TextRun({ text: "Maria Beard", size: 22, font: "Times New Roman" })
//             ], 
//             spacing: { after: 80 } 
//           }),
          
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "Its: VP of Real Estate & Center Expansion", 
//               size: 22, 
//               font: "Times New Roman" 
//             })], 
//             spacing: { after: 400 } 
//           }),

//           // LANDLORD section - exactly matching template  
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "LANDLORD", 
//               bold: true, 
//               size: 22, 
//               font: "Times New Roman" 
//             })], 
//             spacing: { after: 300 } 
//           }),
          
//           // Landlord signature section with handwritten signature placeholder
//           new Paragraph({
//             children: [new TextRun({ 
//               text: "________________________", 
//               size: 22, 
//               font: "Times New Roman" 
//             })],
//             spacing: { after: 80 },
//           }),
          
//           new Paragraph({
//             children: [
//               new TextRun({ text: "By: ", size: 22, font: "Times New Roman" }),
//               new TextRun({ text: "Amaan Maswia", size: 22, font: "Times New Roman", underline: {} }),
//             ],
//             spacing: { after: 80 },
//           }),
          
//           new Paragraph({
//             children: [
//               new TextRun({ text: "Its: ", size: 22, font: "Times New Roman" }),
//               new TextRun({ text: "Partner", size: 22, font: "Times New Roman", underline: {} }),
//             ],
//             spacing: { after: 400 },
//           }),

//           // --- Exhibit A (without page break) ---
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: 'EXHIBIT "A"', 
//               bold: true, 
//               size: 24, 
//               font: "Times New Roman" 
//             })], 
//             alignment: AlignmentType.CENTER, 
//             spacing: { before: 600, after: 80 } 
//           }),
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "PREMISES &", 
//               bold: true, 
//               size: 22, 
//               font: "Times New Roman" 
//             })], 
//             alignment: AlignmentType.CENTER, 
//             spacing: { after: 40 } 
//           }),
//           new Paragraph({ 
//             children: [new TextRun({ 
//               text: "OUTDOOR AREA", 
//               bold: true, 
//               size: 22, 
//               font: "Times New Roman" 
//             })], 
//             alignment: AlignmentType.CENTER, 
//             spacing: { after: 800 } 
//           }),
//         ],
//       },
//     ],
//     styles: {
//       default: {
//         document: { 
//           run: { font: "Times New Roman", size: 22 }, 
//           paragraph: { spacing: { after: 120 } } 
//         },
//       },
//     },
//   });

//   const blob = await Packer.toBlob(doc);
//   saveAs(blob, fileName(data.title));
// };

// Helper function (assuming it exists in your codebase)

export const exportLoiToDocx = async (data: any, logoBase64?: string) => {
  // Load logo if not provided
  if (!logoBase64) {
    logoBase64 = await loadLogo();
  }
  
  const companyName = "The Retail Connection";
  
  // Helper functions
  const safe = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      try {
        return value.filter(item => item !== null && item !== undefined).join(', ');
      } catch (e) {
        return 'N/A';
      }
    }
    if (typeof value === 'object') {
      if (value.value !== undefined) return safe(value.value);
      return 'N/A';
    }
    return String(value);
  };
  
  const fileName = (title?: string): string => {
    return title ? `${title}.docx` : 'LOI_Proposal.docx';
  };

  // Extract data from API response - handle your specific structure
  const responseData = data?.data || data || {};
  
  // Helper to safely get value from nested structure
  const getValue = (fieldName: string) => {
    const field = responseData[fieldName];
    if (!field) return null;
    return field.value || null;
  };

  // Helper to get explanation from nested structure
  const getExplanation = (fieldName: string) => {
    const field = responseData[fieldName];
    if (!field) return null;
    return field.explanation || null;
  };

  const bodyParagraph = (text: string, opts: Partial<Paragraph> = {}) =>
    new Paragraph({
      children: [new TextRun({ text, font: "Times New Roman", size: 22 })],
      spacing: { after: 120 },
      ...opts,
    });

  // Helpers for clean 2-col "Details" table
  const v = (runs: (TextRun | string)[], opts: Partial<Paragraph> = {}) =>
    new Paragraph({
      children: runs.map(r => (typeof r === "string" ? new TextRun({ text: r, font: "Times New Roman", size: 22 }) : r)),
      spacing: { after: 0 },
      ...opts,
    });

  const strong = (t: string) => new TextRun({ text: t, bold: true, font: "Times New Roman", size: 22 });
  const u = (t: string) => new TextRun({ text: t, underline: {}, font: "Times New Roman", size: 22 });
  const linkText = (display: string) => new TextRun({ 
    text: display, 
    font: "Times New Roman", 
    size: 22,
    color: "0000FF", 
    underline: {} 
  });

  const detailRow = (label: string, valueParagraphs: Paragraph[]) =>
    new TableRow({
      children: [
        new TableCell({
          margins: { top: 150, bottom: 150, left: 0, right: 250 },
          width: { size: 25, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          children: [
            new Paragraph({
              children: [new TextRun({ 
                text: `${label}:`, 
                bold: true, 
                italics: true, 
                font: "Times New Roman", 
                size: 22 
              })],
              spacing: { after: 0 },
            }),
          ],
        }),
        new TableCell({
          margins: { top: 150, bottom: 150, left: 0, right: 0 },
          width: { size: 75, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          children: valueParagraphs,
        }),
      ],
    });

  // Get current date for the letter
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Header with logos
  const header = new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        borders: {
          top: { style: BorderStyle.NONE, size: 0 },
          bottom: { style: BorderStyle.NONE, size: 0 },
          left: { style: BorderStyle.NONE, size: 0 },
          right: { style: BorderStyle.NONE, size: 0 },
          insideHorizontal: { style: BorderStyle.NONE, size: 0 },
          insideVertical: { style: BorderStyle.NONE, size: 0 },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                margins: { top: 100, bottom: 100, left: 0, right: 0 },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    children: logoBase64 ? [
                      new ImageRun({
                        data: logoBase64,
                        transformation: { width: 150, height: 60 },
                      })
                    ] : [new TextRun({ 
                      text: "Action Behavior Centers", 
                      font: "Times New Roman", 
                      size: 18,
                      bold: true,
                      color: "4A90E2"
                    })],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                margins: { top: 100, bottom: 100, left: 0, right: 0 },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  new Paragraph({
                    children: [new TextRun({ 
                      text: "FAIR LEASES GROUP", 
                      font: "Times New Roman", 
                      size: 18,
                      bold: true,
                      color: "1E5A96"
                    })],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      
      new Paragraph({
        children: [new TextRun({ text: "________________________________________________________________________________", font: "Times New Roman", size: 16, color: "CCCCCC" })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
      }),
    ],
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        children: [new TextRun({ 
          text: "{Execution Page to Follow}", 
          italics: true, 
          size: 20,
          font: "Times New Roman"
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
      }),
    ],
  });

  // Format commencement date
  const formatCommencementDate = (dateValue: any) => {
    if (!dateValue) return 'TBD';
    try {
      if (typeof dateValue === 'string' && (dateValue.includes('T') || dateValue.includes('-'))) {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      }
      return safe(dateValue);
    } catch (e) {
      return safe(dateValue);
    }
  };

  // Create content sections for better flow
  const createDetailsTable = () => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: {
        top: { style: BorderStyle.NONE, size: 0 },
        bottom: { style: BorderStyle.NONE, size: 0 },
        left: { style: BorderStyle.NONE, size: 0 },
        right: { style: BorderStyle.NONE, size: 0 },
        insideHorizontal: { style: BorderStyle.NONE, size: 0 },
        insideVertical: { style: BorderStyle.NONE, size: 0 },
      },
      rows: Object.entries(responseData)
        .filter(([key, fieldData]: [string, any]) => {
          // Only include fields that have explanations and exclude special sections
          return fieldData && 
                 fieldData.explanation &&
                 !['Lease Rules', 'Important Notes'].includes(key);
        })
        .map(([fieldName, fieldData]: [string, any]) => {
          // Create the content - show only explanation
          const contentParagraphs = [];
          
          // Add only the explanation
          contentParagraphs.push(
            new Paragraph({
              children: [new TextRun({ 
                text: fieldData.explanation, 
                font: "Times New Roman", 
                size: 22,
                color: "333333"
              })],
              spacing: { after: 0 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
          
          return detailRow(fieldName, contentParagraphs);
        }),
    });
  };

  // Create Lease Rules section
  const createLeaseRulesSection = () => {
    if (!responseData['Lease Rules'] || !Array.isArray(responseData['Lease Rules'])) {
      return [];
    }

    return [
      new Paragraph({
        children: [new TextRun({ 
          text: 'LEASE RULES', 
          bold: true, 
          size: 24, 
          font: "Times New Roman" 
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 400 },
      }),
      ...responseData['Lease Rules'].map((ruleItem: any, index: number) => 
        new Paragraph({
          children: [
            new TextRun({ 
              text: `${index + 1}. `, 
              bold: true,
              font: "Times New Roman", 
              size: 22 
            }),
            new TextRun({ 
              text: ruleItem.rule || safe(ruleItem), 
              font: "Times New Roman", 
              size: 22 
            })
          ],
          spacing: { after: 300 },
          alignment: AlignmentType.JUSTIFIED,
        })
      )
    ];
  };

  // Create Important Notes section
  const createImportantNotesSection = () => {
    if (!responseData['Important Notes'] || !Array.isArray(responseData['Important Notes'])) {
      return [];
    }

    return [
      new Paragraph({
        children: [new TextRun({ 
          text: 'IMPORTANT NOTES', 
          bold: true, 
          size: 24, 
          font: "Times New Roman" 
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 400 },
      }),
      ...responseData['Important Notes'].map((noteItem: any, index: number) => 
        new Paragraph({
          children: [
            new TextRun({ 
              text: `${index + 1}. `, 
              bold: true,
              font: "Times New Roman", 
              size: 22 
            }),
            new TextRun({ 
              text: noteItem.clause || safe(noteItem), 
              font: "Times New Roman", 
              size: 22 
            })
          ],
          spacing: { after: 300 },
          alignment: AlignmentType.JUSTIFIED,
        })
      )
    ];
  };

  // Document creation with improved flow
  const doc = new Document({
    creator: companyName,
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 720, bottom: 720, left: 1080, right: 1080 },
            pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
          },
        },
        headers: { default: header },
        footers: { default: footer },
        children: [
          // Date
          new Paragraph({ 
            children: [new TextRun({ 
              text: currentDate, 
              font: "Times New Roman", 
              size: 22 
            })], 
            spacing: { after: 300 } 
          }),
          
          // Contact information
          new Paragraph({ 
            children: [new TextRun({ 
              text: "Andrew Sudderth", 
              bold: true, 
              font: "Times New Roman", 
              size: 22 
            })],
            spacing: { after: 80 }
          }),
          new Paragraph({ 
            children: [new TextRun({ 
              text: "The Retail Connection", 
              font: "Times New Roman", 
              size: 22 
            })],
            spacing: { after: 80 }
          }),
          new Paragraph({ 
            children: [new TextRun({ 
              text: "1000 N Lamar Blvd, Suite 410, Austin, TX 78701", 
              font: "Times New Roman", 
              size: 22 
            })],
            spacing: { after: 80 }
          }),
          new Paragraph({ 
            children: [new TextRun({ 
              text: "(512) 485-0797 X1797 (p)", 
              font: "Times New Roman", 
              size: 22 
            })],
            spacing: { after: 80 }
          }),
          new Paragraph({ 
            children: [new TextRun({ 
              text: "(214) 797-9923 (m)", 
              font: "Times New Roman", 
              size: 22 
            })],
            spacing: { after: 80 }
          }),
          new Paragraph({
            children: [new TextRun({ 
              text: "asudderth@theretailconnection.net", 
              font: "Times New Roman", 
              size: 22, 
              color: "0000FF", 
              underline: {} 
            })],
            spacing: { after: 400 },
          }),
          
          // Re: line with dynamic property
          new Paragraph({
            children: [
              new TextRun({ 
                text: "Re:", 
                bold: true, 
                size: 22, 
                font: "Times New Roman" 
              }),
              new TextRun({ 
                text: `\t\tProposal for National Behavioral Health Operator ${safe(getValue('Property')) || "Property Address"}`, 
                italics: true, 
                size: 22, 
                font: "Times New Roman" 
              }),
            ],
            spacing: { before: 200, after: 400 },
            tabStops: [{ type: TabStopType.LEFT, position: 800 }],
          }),
          
          // Greeting
          new Paragraph({
            children: [new TextRun({ 
              text: "Dear Landlord:", 
              size: 22, 
              font: "Times New Roman" 
            })],
            spacing: { before: 200, after: 300 },
          }),
          
          // Intro paragraph
          bodyParagraph(
            "The following is a proposal to lease space at the above building for your review and consideration.", 
            { spacing: { after: 400 } }
          ),
          
          // Details table with only explanations
          createDetailsTable(),
          
          // Add Important Notes in the flow (after details, before lease rules)
          ...createImportantNotesSection(),
          
          // Add Lease Rules in the flow (after important notes, before non-binding clauses)
          ...createLeaseRulesSection(),
          
          // Non-binding clauses
          bodyParagraph(
            "This letter is not binding and does not constitute an agreement between the parties, but merely sets forth the general terms under which the Tenant agrees to enter further negotiations and is contingent upon the Tenant's review of a draft lease and a definitive written agreement signed by the parties. Tenant Broker makes no warranty or representation to Landlord or Tenant that the acceptance of the proposal will guarantee the execution of a lease for the Premises.",
            { spacing: { before: 400, after: 300 } }
          ),
          
          bodyParagraph(
            "Please review the above lease proposal and provide your comments within seven (7) business days upon receipt. If the above proposal is accepted, we will forward the Lease to you for your review. Please note that the above lease proposal does not bind either party to the terms until the Lease is drawn and executed by both parties.",
            { spacing: { after: 400 } }
          ),
          
          // Signature block
          new Paragraph({ 
            children: [new TextRun({ 
              text: "Sincerely,", 
              size: 22, 
              font: "Times New Roman" 
            })], 
            spacing: { after: 400 } 
          }),
          
          new Paragraph({ 
            children: [new TextRun({ 
              text: "Matthew Paterson", 
              size: 22, 
              font: "Times New Roman" 
            })], 
            spacing: { after: 80 } 
          }),
          new Paragraph({ 
            children: [new TextRun({ 
              text: "Vice President", 
              size: 22, 
              font: "Times New Roman" 
            })], 
            spacing: { after: 80 } 
          }),
          new Paragraph({ 
            children: [new TextRun({ 
              text: "Swearingen Realty Group", 
              size: 22, 
              font: "Times New Roman" 
            })], 
            spacing: { after: 500 } 
          }),
          
          // Agreement section
          new Paragraph({
            children: [
              new TextRun({ 
                text: "AGREED AND ACCEPTED", 
                bold: true, 
                size: 22, 
                font: "Times New Roman" 
              }),
              new TextRun({ 
                text: " on this ", 
                size: 22, 
                font: "Times New Roman" 
              }),
              new TextRun({ 
                text: "____________", 
                underline: {}, 
                size: 22, 
                font: "Times New Roman" 
              }),
              new TextRun({ 
                text: ".", 
                size: 22, 
                font: "Times New Roman" 
              }),
            ],
            spacing: { after: 400 },
          }),
          
          // Tenant signature section
          new Paragraph({ 
            children: [new TextRun({ 
              text: "TENANT", 
              bold: true, 
              size: 22, 
              font: "Times New Roman" 
            })], 
            spacing: { after: 200 } 
          }),
          
          new Paragraph({ 
            children: [new TextRun({ 
              text: "DocuSign Signed by:", 
              size: 16, 
              font: "Times New Roman",
              italics: true,
              color: "666666"
            })], 
            spacing: { after: 80 } 
          }),
          
          new Paragraph({ 
            children: [new TextRun({ 
              text: "Maria Beard", 
              size: 22, 
              font: "Times New Roman",
              underline: {},
              bold: true
            })], 
            spacing: { after: 80 }
          }),
          
          new Paragraph({ 
            children: [
              new TextRun({ text: "By: ", size: 22, font: "Times New Roman" }),
              new TextRun({ text: "Maria Beard", size: 22, font: "Times New Roman" })
            ], 
            spacing: { after: 80 } 
          }),
          
          new Paragraph({ 
            children: [new TextRun({ 
              text: "Its: VP of Real Estate & Center Expansion", 
              size: 22, 
              font: "Times New Roman" 
            })], 
            spacing: { after: 400 } 
          }),
          
          // Landlord signature section
          new Paragraph({ 
            children: [new TextRun({ 
              text: "LANDLORD", 
              bold: true, 
              size: 22, 
              font: "Times New Roman" 
            })], 
            spacing: { after: 300 } 
          }),
          
          new Paragraph({
            children: [new TextRun({ 
              text: "________________________", 
              size: 22, 
              font: "Times New Roman" 
            })],
            spacing: { after: 80 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "By: ", size: 22, font: "Times New Roman" }),
              new TextRun({ text: "Amaan Maswia", size: 22, font: "Times New Roman", underline: {} }),
            ],
            spacing: { after: 80 },
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "Its: ", size: 22, font: "Times New Roman" }),
              new TextRun({ text: "Partner", size: 22, font: "Times New Roman", underline: {} }),
            ],
            spacing: { after: 400 },
          }),
          
          // Exhibit A
          new Paragraph({ 
            children: [new TextRun({ 
              text: 'EXHIBIT "A"', 
              bold: true, 
              size: 24, 
              font: "Times New Roman" 
            })], 
            alignment: AlignmentType.CENTER, 
            spacing: { before: 600, after: 80 } 
          }),
          new Paragraph({ 
            children: [new TextRun({ 
              text: "PREMISES &", 
              bold: true, 
              size: 22, 
              font: "Times New Roman" 
            })], 
            alignment: AlignmentType.CENTER, 
            spacing: { after: 40 } 
          }),
          new Paragraph({ 
            children: [new TextRun({ 
              text: "OUTDOOR AREA", 
              bold: true, 
              size: 22, 
              font: "Times New Roman" 
            })], 
            alignment: AlignmentType.CENTER, 
            spacing: { after: 400 } 
          }),
        ],
      },
    ],
    styles: {
      default: {
        document: { 
          run: { font: "Times New Roman", size: 22 }, 
          paragraph: { spacing: { after: 120 } } 
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  const propertyForFilename = getValue('Property') || 'LOI_Proposal';
  saveAs(blob, fileName(propertyForFilename));
};