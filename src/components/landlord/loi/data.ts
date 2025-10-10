import { Clause, LOI } from "./types";

export const LOIS: LOI[] = [
  { id:"1", title:"Downtown Office Space LOI", company:"TechCorp Solutions",
    address:"123 Main St, Suite 400", rent:"$8,500/mo", date:"15/01/2024",
    status:"New", approved:0, pending:12, tenantName:"TechCorp Solutions" },
  { id:"2", title:"Retail Space Proposal", company:"Urban Boutique LLC",
    address:"456 Commerce Ave", rent:"$4,200/mo", date:"12/01/2024",
    status:"In Review", approved:3, pending:5, tenantName:"Urban Boutique LLC" },
  { id:"3", title:"Warehouse Lease Intent", company:"LogiFlow Industries",
    address:"789 Industrial Blvd", rent:"$12,000/mo", date:"10/01/2024",
    status:"Finalized", approved:15, pending:0, tenantName:"LogiFlow Industries" },
  { id:"4", title:"Medical Office LOI", company:"MedCare Associates",
    address:"321 Health Plaza", rent:"$6,800/mo", date:"08/01/2024",
    status:"Rejected", approved:2, pending:0, tenantName:"MedCare Associates" },
];

export const CLAUSES: Clause[] = [
  { id:"c1", title:"Base Rent", risk:"Low", approved:2,
    text:"Tenant agrees to pay base rent of $8,500 per month, payable in advance on the first day of each month during the lease term.",
    aiNote:"Standard rent clause with acceptable terms." },
  { id:"c2", title:"Security Deposit", risk:"Medium", comments:1,
    text:"Tenant shall provide a security deposit equal to three (3) months' base rent, totaling $25,500, to be held by Landlord as security for Tenant's performance.",
    aiNote:"Consider reducing to 2 months' rent to remain competitive in current market." },
  { id:"c3", title:"Maintenance Responsibilities", risk:"High", comments:1, issue:"Jurisdiction Issue",
    text:"Tenant responsible for all routine maintenance, including HVAC systems, plumbing, and electrical within the premises.",
    aiNote:"High risk due to broad tenant responsibility; consider splitting responsibilities and capping annual maintenance spend." },
  { id:"c4", title:"Assignment and Subletting", risk:"Low", comments:0,
    text:"Tenant may not assign this lease or sublet the premises without prior written consent from Landlord, not to be unreasonably withheld." },
];
