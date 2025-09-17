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

export const exportLoiToDocx = async (data: any, logoBase64?: string) => {
  try {
    // Load logo if not provided
    if (!logoBase64) {
      logoBase64 = await loadLogo();
    }

    // Helper functions with better error handling
    const safe = (value: any): string => {
      if (value === null || value === undefined) return 'N/A';
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) {
        try {
          const validItems = value.filter(item =>
            item !== null &&
            item !== undefined &&
            item !== '' &&
            (typeof item === 'string' || typeof item === 'object')
          );
          return validItems.length > 0 ? validItems.join(', ') : 'N/A';
        } catch (e) {
          console.warn('Error processing array:', e);
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
      const sanitizedTitle = title ? title?.replace(/[<>:"/\\|?*]/g, '_') : 'LOI_Proposal';
      return `${sanitizedTitle}.docx`;
    };

    // Validate and extract data from API response
    if (!data) {
      throw new Error('No data provided for document generation');
    }

    const responseData = data?.data?.data || data?.data || data || {};
    const headerData = data?.data?.data?.header || data?.data?.header || data?.header || {};
    const footerData = data?.data?.data?.Footer || data?.data?.Footer || data?.Footer || {};

    // Helper to safely get value from nested structure
    const getValue = (fieldName: string) => {
      try {
        const field = responseData[fieldName];
        if (!field) return null;
        return field.value || field || null;
      } catch (e) {
        console.warn(`Error getting value for ${fieldName}:`, e);
        return null;
      }
    };

    const bodyParagraph = (text: string, opts: Partial<Paragraph> = {}) => {
      const safeText = safe(text);
      return new Paragraph({
        children: [new TextRun({ text: safeText, font: "Times New Roman", size: 22 })],
        spacing: { after: 120 },
        ...opts,
      });
    };

    const detailRow = (label: string, valueParagraphs: Paragraph[]) => {
      // Ensure label is valid
      const safeLabel = safe(label);
      // Ensure valueParagraphs is an array
      const safeParagraphs = Array.isArray(valueParagraphs) ? valueParagraphs : [bodyParagraph('N/A')];

      return new TableRow({
        children: [
          new TableCell({
            margins: { top: 150, bottom: 150, left: 0, right: 250 },
            width: { size: 25, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                children: [new TextRun({
                  text: `${safeLabel}:`,
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
            children: safeParagraphs,
          }),
        ],
      });
    };

    // Get current date for the letter
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Header with logos - with better error handling
    const createHeader = () => {
      const logoChildren = [];

      if (logoBase64 && typeof logoBase64 === 'string' && logoBase64.length > 0) {
        try {
          logoChildren.push(new ImageRun({
            data: logoBase64,
            transformation: { width: 150, height: 60 },
          }));
        } catch (e) {
          console.warn('Error creating logo image:', e);
          logoChildren.push(new TextRun({
            text: "Action Behavior Centers",
            font: "Times New Roman",
            size: 18,
            bold: true,
            color: "4A90E2"
          }));
        }
      } else {
        logoChildren.push(new TextRun({
          text: "Action Behavior Centers",
          font: "Times New Roman",
          size: 18,
          bold: true,
          color: "4A90E2"
        }));
      }

      return new Header({
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
                        children: logoChildren,
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
            children: [new TextRun({
              text: "________________________________________________________________________________",
              font: "Times New Roman",
              size: 16,
              color: "CCCCCC"
            })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          }),
        ],
      });
    };

    const footer = new Footer({
      children: [
        new Paragraph({
          children: [new TextRun({
            text: "", // Removed the execution page text as per original
            italics: true,
            size: 20,
            font: "Times New Roman"
          })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
      ],
    });

    // Create content sections with better error handling
    const createDetailsTable = () => {
      try {
        const entries = Object.entries(responseData).filter(([key, fieldData]: [string, any]) => {
          // Only include fields that have content and exclude special sections and arrays
          return fieldData &&
            typeof fieldData === 'string' &&
            fieldData.trim() !== '' &&
            !['Important Notes', 'LOI Rules', 'header', 'Footer'].includes(key);
        });

        if (entries.length === 0) {
          // Return empty table if no valid entries
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
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [bodyParagraph('No additional details available.')],
                  }),
                ],
              }),
            ],
          });
        }

        const rows = entries.map(([fieldName, fieldData]: [string, any]) => {
          try {
            const contentParagraphs = [
              new Paragraph({
                children: [new TextRun({
                  text: safe(fieldData),
                  font: "Times New Roman",
                  size: 22,
                  color: "333333"
                })],
                spacing: { after: 0 },
                alignment: AlignmentType.JUSTIFIED,
              })
            ];

            return detailRow(fieldName, contentParagraphs);
          } catch (e) {
            console.warn(`Error processing field ${fieldName}:`, e);
            return detailRow(fieldName, [bodyParagraph('Error processing field')]);
          }
        });

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
          rows: rows,
        });
      } catch (e) {
        console.error('Error creating details table:', e);
        // Return a simple table with error message
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
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [bodyParagraph('Error generating details table.')],
                }),
              ],
            }),
          ],
        });
      }
    };

    // Create document with comprehensive error handling
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: { width: 11906, height: 16838 },
              margin: { top: 720, bottom: 720, left: 1080, right: 1080 },
              pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
            },
          },
          headers: { default: createHeader() },
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

            // Tenant information
            new Paragraph({
              children: [new TextRun({
                text: safe(headerData?.landlord_name) || "Tenant Name",
                bold: true,
                font: "Times New Roman",
                size: 22
              })],
              spacing: { after: 80 }
            }),
            new Paragraph({
              children: [new TextRun({
                text: safe(headerData?.address) || "1000 N Lamar Blvd, Suite 410, Austin, TX 78701",
                font: "Times New Roman",
                size: 22
              })],
              spacing: { after: 80 }
            }),

            new Paragraph({
              children: [new TextRun({
                text: safe(headerData?.landlord_email),
                font: "Times New Roman",
                size: 22,
                color: "0000FF",
                underline: {}
              })],
              spacing: { after: 400 },
            }),

            // Re: line
            new Paragraph({
              children: [
                new TextRun({
                  text: "Re:",
                  bold: true,
                  size: 22,
                  font: "Times New Roman"
                }),
                new TextRun({
                  text: `\t\t${safe(headerData?.re) || `Proposal for National Behavioral Health Operator ${safe(headerData?.address) || safe(getValue('Property')) || "Property Address"}`}`,
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
                text: safe(headerData?.start) || `Dear ${safe(headerData?.landlord_name) || 'Landlord'}:`,
                size: 22,
                font: "Times New Roman"
              })],
              spacing: { before: 200, after: 300 },
            }),

            bodyParagraph(headerData?.Subject ||
              "The following is a proposal to lease space at the above building for your review and consideration.",
              { spacing: { after: 400 } }
            ),

            // Details table
            createDetailsTable(),

            bodyParagraph(
              "This letter is not binding and does not constitute an agreement between the parties, but merely sets forth the general terms under which the Tenant agrees to enter further negotiations and is contingent upon the Tenant's review of a draft lease and a definitive written agreement signed by the parties. Tenant Broker makes no warranty or representation to Landlord or Tenant that the acceptance of the proposal will guarantee the execution of a lease for the Premises.",
              { spacing: { before: 400, after: 300 } }
            ),

            bodyParagraph(
              "Please review the above lease proposal and provide your comments within seven (7) business days upon receipt. If the above proposal is accepted, we will forward the Lease to you for your review. Please note that the above lease proposal does not bind either party to the terms until the Lease is drawn and executed by both parties.",
              { spacing: { after: 400 } }
            ),

            // AGREED AND ACCEPTED line
            new Paragraph({
              children: [
                new TextRun({
                  text: "AGREED AND ACCEPTED",
                  bold: true,
                  size: 22,
                  font: "Times New Roman"
                }),
                new TextRun({
                  text: " on this Date : ",
                  size: 22,
                  font: "Times New Roman"
                }),
                new TextRun({
                  text: currentDate,
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

            // Side-by-side signature table
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
                    // TENANT COLUMN
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      margins: { top: 0, bottom: 0, left: 0, right: 200 },
                      verticalAlign: VerticalAlign.TOP,
                      children: [
                        // Tenant header
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
                            text: "________________________",
                            size: 22,
                            font: "Times New Roman"
                          })],
                          spacing: { after: 80 },
                        }),


                        // Tenant name (underlined)
                        new Paragraph({
                          children: [new TextRun({
                            text: safe(footerData.tenant_name) || "Tenant Name",
                            size: 22,
                            font: "Times New Roman",
                            underline: {},
                            bold: true
                          })],
                          spacing: { after: 80 }
                        }),

                        // By line
                        new Paragraph({
                          children: [
                            new TextRun({ text: "By: ", size: 22, font: "Times New Roman" }),
                            new TextRun({ text: safe(footerData.tenant_name) || "Maria Beard", size: 22, font: "Times New Roman" })
                          ],
                          spacing: { after: 80 }
                        }),

                        // Tenant email (conditional)
                        ...(footerData.tenant_emial ? [
                          new Paragraph({
                            children: [new TextRun({
                              text: safe(footerData.tenant_emial),
                              font: "Times New Roman",
                              size: 20,
                              color: "0000FF",
                              underline: {}
                            })],
                            spacing: { after: 80 },
                          })
                        ] : []),
                      ],
                    }),

                    // LANDLORD COLUMN
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      margins: { top: 0, bottom: 0, left: 200, right: 0 },
                      verticalAlign: VerticalAlign.TOP,
                      children: [
                        // Landlord header
                        new Paragraph({
                          children: [new TextRun({
                            text: "LANDLORD",
                            bold: true,
                            size: 22,
                            font: "Times New Roman"
                          })],
                          spacing: { after: 200 }
                        }),

                        // Signature line
                        new Paragraph({
                          children: [new TextRun({
                            text: "________________________",
                            size: 22,
                            font: "Times New Roman"
                          })],
                          spacing: { after: 80 },
                        }),

                        // By line with landlord name
                        new Paragraph({
                          children: [
                            new TextRun({ text: "By: ", size: 22, font: "Times New Roman" }),
                            new TextRun({ text: safe(headerData.landlord_name) || "Landlord Name", size: 22, font: "Times New Roman", underline: {} }),
                          ],
                          spacing: { after: 80 },
                        }),

                        // Title line
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Its: ", size: 22, font: "Times New Roman" }),
                            new TextRun({ text: "Partner", size: 22, font: "Times New Roman", underline: {} }),
                          ],
                          spacing: { after: 80 },
                        }),

                        // Landlord email (conditional)
                        ...(headerData.landlord_email ? [
                          new Paragraph({
                            children: [new TextRun({
                              text: safe(headerData.landlord_email),
                              font: "Times New Roman",
                              size: 20,
                              color: "0000FF",
                              underline: {}
                            })],
                            spacing: { after: 80 },
                          })
                        ] : []),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            // Add some spacing after the signature table
            new Paragraph({
              children: [],
              spacing: { after: 400 },
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

    // Generate and save document
    const blob = await Packer.toBlob(doc);
    const propertyForFilename = getValue('Property') || 'LOI_Proposal';
    saveAs(blob, fileName(propertyForFilename));

    console.log('Document generated successfully');

  } catch (error) {
    console.error('Error generating DOCX:', error);

    // Show user-friendly error message
    alert(`Error generating document: ${error.message || 'Unknown error occurred'}`);

    // Optionally, you could create a simple fallback document
    try {
      const fallbackDoc = new Document({
        sections: [{
          children: [
            new Paragraph({
              children: [new TextRun({
                text: "Error generating document. Please check your data and try again.",
                font: "Times New Roman",
                size: 22
              })],
            })
          ]
        }]
      });

      const fallbackBlob = await Packer.toBlob(fallbackDoc);
      saveAs(fallbackBlob, 'Error_Document.docx');
    } catch (fallbackError) {
      console.error('Failed to create fallback document:', fallbackError);
    }
  }
};
