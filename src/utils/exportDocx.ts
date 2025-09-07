// utils/exportDocx.ts
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { LOIApiPayload } from "@/types/loi";

export const exportLoiToDocx = async (data: LOIApiPayload) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Letter of Intent", bold: true, size: 28 })],
          }),
          new Paragraph({ text: `Title: ${data.title}` }),
          new Paragraph({ text: `Property Address: ${data.propertyAddress}` }),
          new Paragraph({ text: `Landlord: ${data.partyInfo.landlord_name}` }),
          new Paragraph({ text: `Tenant: ${data.partyInfo.tenant_name}` }),
          new Paragraph({ text: `Monthly Rent: ${data.leaseTerms.monthlyRent}` }),
          new Paragraph({ text: `Lease Duration: ${data.leaseTerms.leaseDuration}` }),
          new Paragraph({ text: `Start Date: ${data.leaseTerms.startDate}` }),
          new Paragraph({ text: `Utilities: ${data.propertyDetails.utilities.join(", ")}` }),
          new Paragraph({ text: `Special Conditions: ${data.additionalDetails.specialConditions}` }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.title || "LOI"}.docx`);
};
