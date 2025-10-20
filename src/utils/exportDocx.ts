// utils/exportDocx.ts
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  ImageRun,
  NumberFormat,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  TabStopType,
  UnderlineType,
  type IParagraphOptions,
} from "docx";
import { saveAs } from "file-saver";

const loadLogo = async (): Promise<string | undefined> => {
  try {
    const response = await fetch("/logo.png");
    if (!response.ok) return undefined;

    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Could not load logo:", error);
    return undefined;
  }
};

export interface LOIHeader {
  landlord_name?: string;
  address?: string;
  landlord_email?: string;
  re?: string;
  start?: string;
  Subject?: string;
  tenant_home_town_address?: string
}

type ClauseEntry = {
  status?: string;
  current_version?: unknown;
  clause_details?: unknown;
};

type ClauseMap = Record<string, ClauseEntry>;


export interface LOIFooter {
  tenant_name?: string;
  tenant_email?: string;
  tenant_emial?: string; // typo supported
  tenant_address_S2?: string;
  tenant_address_S1?: string;
  tenant_zip?: string;
  tenant_city?: string;
  tenant_state?: string;


}

export interface LOIResponseBody {
  header?: LOIHeader;
  Footer?: LOIFooter;
}

export interface LOIResponse {
  data?:
  | { data?: LOIResponseBody; header?: LOIHeader; Footer?: LOIFooter }
  | LOIResponseBody;
  header?: LOIHeader;
  Footer?: LOIFooter;
}

interface NormalizedData {
  body: Record<string, string>;
  header: LOIHeader;
  footer: LOIFooter;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const hasProp = <K extends string>(
  o: unknown,
  key: K
): o is Record<K, unknown> => isRecord(o) && key in o;


const isLOIHeader = (v: unknown): v is LOIHeader => isRecord(v);
const isLOIFooter = (v: unknown): v is LOIFooter => isRecord(v);
const isLOIResponseBody = (v: unknown): v is LOIResponseBody => isRecord(v);


const toStringSafe = (v: unknown): string => {
  if (v === null || v === undefined) return "N/A";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    const parts = v
      .map((x) =>
        typeof x === "string" ? x : isRecord(x) ? JSON.stringify(x) : null
      )
      .filter((x): x is string => !!x);
    return parts.length ? parts.join(", ") : "N/A";
  }
  if (isRecord(v) && "value" in v) {
    return toStringSafe((v as { value?: unknown }).value);
  }
  return "N/A";
};

const normalizeResponse = (raw: LOIResponse): NormalizedData => {

  let nestedData: LOIResponseBody = {};

  if (hasProp(raw, "data")) {
    const d = raw.data; 

    if (hasProp(d, "data") && isLOIResponseBody(d.data)) {
      nestedData = d.data;
    } else if (isLOIResponseBody(d)) {
      nestedData = d;
    }
  } else if (isLOIResponseBody(raw)) {
    nestedData = raw;
  }

  console.log("nestedData", nestedData)

  let header: LOIHeader = {};
  if (hasProp(raw, "data") && hasProp(raw.data, "header") && isLOIHeader(raw.data.header)) {
    header = raw.data.header;
  } else if (hasProp(nestedData, "header") && isLOIHeader(nestedData.header)) {
    header = nestedData.header;
  } else if (hasProp(raw, "header") && isLOIHeader(raw.header)) {
    header = raw.header;
  }

  let footer: LOIFooter = {};
  if (hasProp(raw, "data") && hasProp(raw.data, "Footer") && isLOIFooter(raw.data.Footer)) {
    footer = raw.data.Footer;
  } else if (hasProp(nestedData, "Footer") && isLOIFooter(nestedData.Footer)) {
    footer = nestedData.Footer;
  } else if (hasProp(raw, "Footer") && isLOIFooter(raw.Footer)) {
    footer = raw.Footer;
  }

  const body: Record<string, string> = {};
  Object.entries(nestedData as Record<string, unknown>).forEach(([k, v]) => {
    body[k] = toStringSafe(v);
  });

  return { body, header, footer };
};

export const exportLoiToDocx = async (data: LOIResponse, logoBase64?: string, isTemp?: boolean) => {

  console.log(isTemp, "174")
  const base64ToUint8Array = (b64: string): Uint8Array => {
    const clean = b64.includes(",") ? b64.split(",").pop()! : b64;
    const binary =
      typeof atob !== "undefined"
        ? atob(clean)
        : Buffer.from(clean, "base64").toString("binary");
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  };

  const getRasterTypeFromDataUri = (
    maybeDataUri: string
  ): "png" | "jpg" | "gif" | "bmp" | null => {
    if (!maybeDataUri.startsWith("data:")) return null;
    const mime = maybeDataUri.slice(5, maybeDataUri.indexOf(";")).toLowerCase();
    if (mime.endsWith("png")) return "png";
    if (mime.endsWith("jpeg") || mime.endsWith("jpg")) return "jpg";
    if (mime.endsWith("gif")) return "gif";
    if (mime.endsWith("bmp")) return "bmp";
  if (mime.includes("svg")) return null; 
    return null;
  };

  const looksLikeSvg = (s: string) =>
    s.trim().startsWith("<svg") || s.toLowerCase().includes("image/svg+xml");

  try {
    if (!logoBase64) {
      logoBase64 = await loadLogo();
    }

    const safe = (value: unknown): string => toStringSafe(value);

    if (!data) {
      throw new Error("No data provided for document generation");
    }
    const { body, header: headerData, footer: footerData } = normalizeResponse(data);


    const getValue = (fieldName: string): string | null => {
      const v = body[fieldName];
      if (!v) return null;
      return v === "N/A" ? null : v;
    };

    let disclaimerText = "";

    if (isRecord(data) && hasProp(data, 'data')) {
      const d = data;
      console.log("d",d)
      if (isRecord(d) && hasProp(d, 'text')) {
        disclaimerText = String(d.text); 
        console.log("Found text from API:", disclaimerText.substring(0, 100) + "...");
      }
    }

    let clauseMap: ClauseMap | undefined;

    if (isRecord(data) && hasProp(data, "data")) {
      const d = data.data;

      if (isRecord(d) && hasProp(d, "data")) {
        const inner = d.data;
        if (isRecord(inner)) {
          clauseMap = Object.fromEntries(
            Object.entries(inner).map(([k, v]) => [k, (v as ClauseEntry)])
          );
        }
      }
    }

    const fileName = (): string => {

      const sanitizedTitle = headerData.re;
      return `${sanitizedTitle}.docx`;
    };

    const bodyParagraph = (
      text: string,
      opts: Partial<IParagraphOptions> = {}
    ) => {
      const safeText = safe(text);
      const base: IParagraphOptions = {
        children: [new TextRun({ text: safeText, font: "Times New Roman", size: 22 })],
        spacing: { after: 120 },
        ...opts,
      };
      return new Paragraph(base);
    };

    const detailRow = (label: string, valueParagraphs: Paragraph[]) => {
      const safeLabel = safe(label);
      const safeParagraphs = Array.isArray(valueParagraphs)
        ? valueParagraphs
        : [bodyParagraph("N/A")];

      return new TableRow({
        children: [
          new TableCell({
            margins: { top: 150, bottom: 150, left: 0, right: 250 },
            width: { size: 25, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${safeLabel}:`,
                    bold: true,
                    italics: true,
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
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
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Header with logo (raster only; SVG falls back to text)
    function createHeader() {
      const logoRuns: (ImageRun | TextRun)[] = [];

      if (logoBase64 && typeof logoBase64 === "string" && logoBase64.length > 0) {
        try {
          if (looksLikeSvg(logoBase64)) {
            // Fallback text if SVG (docx needs raster)
            logoRuns.push(
              new TextRun({
                text: "Action Behavior Centers",
                font: "Times New Roman",
                size: 18,
                bold: true,
                color: "4A90E2",
              })
            );
          } else {
            const imgType =
              getRasterTypeFromDataUri(logoBase64) || "png"; // default
            const bytes = base64ToUint8Array(logoBase64);
            logoRuns.push(
              new ImageRun({
                data: bytes,
                type: imgType, // "png" | "jpg" | "gif" | "bmp"
                transformation: { width: 150, height: 60 },
              })
            );
          }
        } catch (e) {
          console.warn("Error creating logo image:", e);
          logoRuns.push(
            new TextRun({
              text: "Action Behavior Centers",
              font: "Times New Roman",
              size: 18,
              bold: true,
              color: "4A90E2",
            })
          );
        }
      } else {
        logoRuns.push(
          new TextRun({
            text: "Action Behavior Centers",
            font: "Times New Roman",
            size: 18,
            bold: true,
            color: "4A90E2",
          })
        );
      }

      return new Header({
        children: [
          // Single-cell table to span full width; all content centered
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
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    margins: { top: 100, bottom: 100, left: 0, right: 0 },
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                      // Logo (or fallback text), centered
                      new Paragraph({
                        children: logoRuns,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 100 },
                      }),
                      // Title, centered
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "FAIR LEASES GROUP",
                            font: "Times New Roman",
                            size: 18,
                            bold: true,
                            color: "1E5A96",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Thin divider line, centered
          new Paragraph({
            children: [
              new TextRun({
                text:
                  "________________________________________________________________________________",
                font: "Times New Roman",
                size: 16,
                color: "CCCCCC",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          }),
        ],
      });
    }


    const footer = new Footer({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: "",
              italics: true,
              size: 20,
              font: "Times New Roman",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
      ],
    });

    const clauseParagraphsFor = (_name: string, entry: ClauseEntry): Paragraph[] => {
      const status = String(entry?.status ?? "").toLowerCase();
      const current = safe(entry?.current_version ?? "");
      const details = safe(entry?.clause_details ?? "");

      if (status === "rejected") {
        return [
          // clause_details in red
          new Paragraph({
            children: [
              new TextRun({
                text: details || "—",
                font: "Times New Roman",
                size: 22,
                color: "FF0000",
              }),
            ],
            spacing: { after: 0 },
            alignment: AlignmentType.JUSTIFIED,
          }),
          // blank line (skip one line)
          new Paragraph({ children: [new TextRun({ text: "" })], spacing: { after: 120 } }),
          // current_version in black
          new Paragraph({
            children: [
              new TextRun({
                text: current || "—",
                font: "Times New Roman",
                size: 22,
                color: "000000",
              }),
            ],
            spacing: { after: 0 },
            alignment: AlignmentType.JUSTIFIED,
          }),
        ];
      }

      if (status === "approved") {
        return [
          new Paragraph({
            children: [
              new TextRun({
                text: current || "—",
                font: "Times New Roman",
                size: 22,
                color: "000000",
              }),
            ],
            spacing: { after: 0 },
            alignment: AlignmentType.JUSTIFIED,
          }),
        ];
      }

      // default (pending/unknown)
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: current || "—",
              font: "Times New Roman",
              size: 22,
              color: "000000",
            }),
          ],
          spacing: { after: 0 },
          alignment: AlignmentType.JUSTIFIED,
        }),
      ];
    };

    // Details table
    const createDetailsTable = () => {
      try {
        const entries = Object.entries(body as Record<string, unknown>)
          .filter(([key, value]) =>
            typeof value === "string" &&
            value.trim() !== "" &&
            !["Important Notes", "LOI Rules", "header", "Footer"].includes(key)
          ) as Array<[string, string]>;

        if (entries.length === 0) {
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
                    children: [bodyParagraph("No additional details available.")],
                  }),
                ],
              }),
            ],
          });
        }

        const rows = entries.map(([fieldName, fieldData]) => {
          try {
            const contentParagraphs = [
              new Paragraph({
                children: [
                  new TextRun({
                    text: fieldData,
                    font: "Times New Roman",
                    size: 22,
                    color: "333333",
                  }),
                ],
                spacing: { after: 0 },
                alignment: AlignmentType.JUSTIFIED,
              }),
            ];

            return detailRow(fieldName, contentParagraphs);
          } catch (e) {
            console.warn(`Error processing field ${fieldName}:`, e);
            return detailRow(fieldName, [bodyParagraph("Error processing field")]);
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
          rows,
        });
      } catch (e) {
        console.error("Error creating details table:", e);
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
                  children: [bodyParagraph("Error generating details table.")],
                }),
              ],
            }),
          ],
        });
      }
    };

    const createClauseReviewTable = () => {
      if ( !clauseMap || Object.keys(clauseMap).length === 0) {
      console.log("thins is running")
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
          rows: [new TableRow({ children: [new TableCell({ children: [] })] })],
        });
      }

      const rows: TableRow[] = [];

      // Data rows
      for (const [name, entry] of Object.entries(clauseMap)) {
        console.log("this is runnig")
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                margins: { top: 150, bottom: 150, left: 0, right: 250 },
                width: { size: 30, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.TOP,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${toStringSafe(name)}:`,
                        bold: true,
                        italics: true,
                        font: "Times New Roman",
                        size: 22,
                      }),
                    ],
                    spacing: { after: 0 },
                  }),
                  ...(entry?.status
                    ? [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Status: ${String(entry.status)}`,
                            font: "Times New Roman",
                            size: 18,
                            color: "666666",
                          }),
                        ],
                        spacing: { after: 0 },
                      }),
                    ]
                    : []),
                ],
              }),
              new TableCell({
                margins: { top: 150, bottom: 150, left: 0, right: 0 },
                width: { size: 70, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.TOP,
                children: clauseParagraphsFor(name, entry),
              }),
            ],
          })
        );
      }

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
        rows,
      });
    };

    const zip = safe(footerData?.tenant_zip);
    const state = safe(footerData?.tenant_state);

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
              children: [new TextRun({ text: currentDate, font: "Times New Roman", size: 22 })],
              spacing: { after: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text:
                    safe(footerData?.tenant_name),
                  font: "Times New Roman",
                  size: 22,
                }),
              ],
              spacing: { after: 80 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: safe(footerData?.tenant_email),
                  font: "Times New Roman",
                  size: 22,
                  color: "0000FF",
                  underline: { type: UnderlineType.SINGLE },
                }),
              ],
              spacing: { after: 80 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: safe(footerData?.tenant_address_S1),
                  font: "Times New Roman",
                  size: 22,
                }),
              ],
              spacing: { after: 80 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: safe(footerData?.tenant_address_S2),
                  font: "Times New Roman",
                  size: 22,
                }),
              ],
              spacing: { after: 80 },
            }),


            new Paragraph({
              children: [
                new TextRun({
                  text: safe(footerData?.tenant_city),
                  font: "Times New Roman",
                  size: 22,
                }),
              ],
              spacing: { after: 80 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: [zip, state].filter(Boolean).join(", "), 
                  font: "Times New Roman",
                  size: 22,
                }),
              ],
              spacing: { after: 80 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Re:", bold: true, size: 22, font: "Times New Roman" }),
                new TextRun({
                  text: `\t\t${safe(headerData?.re) ||
                    `Proposal for National Behavioral Health Operator ${safe(headerData?.address) || safe(getValue("Property")) || "Property Address"
                    }`
                    }`,
                  italics: true,
                  size: 22,
                  font: "Times New Roman",
                }),
              ],
              spacing: { before: 200, after: 400 },
              tabStops: [{ type: TabStopType.LEFT, position: 800 }],
            }),

            // Greeting
            new Paragraph({
              children: [
                new TextRun({
                  text:
                    safe(headerData?.start) ||
                    `Dear ${safe(footerData?.tenant_name) || "Tenant"}:`,
                  size: 22,
                  font: "Times New Roman",
                }),
              ],
              spacing: { before: 200, after: 300 },
            }),

            bodyParagraph(
              headerData?.Subject ||
              "The following is a proposal to lease space at the above building for your review and consideration.",
              { spacing: { after: 400 } }
            ),

            ...(isTemp
              ? [
                createClauseReviewTable(),
              ]
              : [createDetailsTable()]),

            new Paragraph({ pageBreakBefore: true }),

            bodyParagraph(disclaimerText, { spacing: { after: 400 } }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "AGREED AND ACCEPTED",
                  bold: true,
                  size: 22,
                  font: "Times New Roman",
                }),
                new TextRun({ text: " on this Date : ", size: 22, font: "Times New Roman" }),
                new TextRun({
                  text: currentDate,
                  underline: { type: UnderlineType.SINGLE },
                  size: 22,
                  font: "Times New Roman",
                }),
                new TextRun({ text: ".", size: 22, font: "Times New Roman" }),
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
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "TENANT",
                              bold: true,
                              size: 22,
                              font: "Times New Roman",
                            }),
                          ],
                          spacing: { after: 200 },
                        }),

                        new Paragraph({
                          children: [
                            new TextRun({ text: "________________________", size: 22, font: "Times New Roman" }),
                          ],
                          spacing: { after: 80 },
                        }),

                        // Tenant name (underlined)
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: safe(footerData.tenant_name),
                              size: 22,
                              font: "Times New Roman",
                              underline: { type: UnderlineType.SINGLE },
                              bold: true,
                            }),
                          ],
                          spacing: { after: 80 },
                        }),

                        // By line
                        new Paragraph({
                          children: [
                            new TextRun({ text: "By: ", size: 22, font: "Times New Roman" }),
                            new TextRun({
                              text: safe(footerData.tenant_name) || "Maria Beard",
                              size: 22,
                              font: "Times New Roman",
                            }),
                          ],
                          spacing: { after: 80 },
                        }),

                        // Tenant email (supports typo key as well)
                        ...(footerData.tenant_email
                          ? [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: safe(footerData.tenant_email),
                                  font: "Times New Roman",
                                  size: 20,
                                  color: "0000FF",
                                  underline: { type: UnderlineType.SINGLE },
                                }),
                              ],
                              spacing: { after: 80 },
                            }),
                          ]
                          : []),


                      ],
                    }),

                    // LANDLORD COLUMN
                    new TableCell({
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      margins: { top: 0, bottom: 0, left: 200, right: 0 },
                      verticalAlign: VerticalAlign.TOP,
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "LANDLORD",
                              bold: true,
                              size: 22,
                              font: "Times New Roman",
                            }),
                          ],
                          spacing: { after: 200 },
                        }),

                        new Paragraph({
                          children: [
                            new TextRun({ text: "________________________", size: 22, font: "Times New Roman" }),
                          ],
                          spacing: { after: 80 },
                        }),

                        new Paragraph({
                          children: [
                            new TextRun({ text: "By: ", size: 22, font: "Times New Roman" }),
                            new TextRun({
                              text: safe(headerData.landlord_name) || "Landlord Name",
                              size: 22,
                              font: "Times New Roman",
                              underline: { type: UnderlineType.SINGLE },
                            }),
                          ],
                          spacing: { after: 80 },
                        }),

                        // new Paragraph({
                        //   children: [
                        //     new TextRun({ text: "Its: ", size: 22, font: "Times New Roman" }),
                        //     new TextRun({
                        //       text: "Partner",
                        //       size: 22,
                        //       font: "Times New Roman",
                        //       underline: { type: UnderlineType.SINGLE },
                        //     }),
                        //   ],
                        //   spacing: { after: 80 },
                        // }),

                        ...(headerData.landlord_email
                          ? [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: safe(headerData.landlord_email),
                                  font: "Times New Roman",
                                  size: 20,
                                  color: "0000FF",
                                  underline: { type: UnderlineType.SINGLE },
                                }),
                              ],
                              spacing: { after: 80 },
                            }),
                          ]
                          : []),
                      ],
                    }),
                  ],
                }),
              ],
            }),

            // spacing after the signature table
            new Paragraph({ children: [], spacing: { after: 400 } }),
          ],
        },
      ],
      styles: {
        default: {
          document: {
            run: { font: "Times New Roman", size: 22 },
            paragraph: { spacing: { after: 120 } },
          },
        },
      },
    });

    // Generate and save document
    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName());

    console.log("Document generated successfully");
  } catch (error) {
    console.error("Error generating DOCX:", error);

    const msg =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error occurred";

    alert(`Error generating document: ${msg}`);

    // Fallback document
    try {
      const fallbackDoc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Error generating document. Please check your data and try again.",
                    font: "Times New Roman",
                    size: 22,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const fallbackBlob = await Packer.toBlob(fallbackDoc);
      saveAs(fallbackBlob, "Error_Document.docx");
    } catch (fallbackError) {
      console.error("Failed to create fallback document:", fallbackError);
    }
  }
};
