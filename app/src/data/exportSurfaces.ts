import { draftCardFromDesign, generateCardSummary } from "../domain/card";
import { draftRubricFromDesign } from "../domain/rubric";
import type { DistributionDocument, EmcureDesign } from "../domain/types";

export interface ExportSurfaceOptions {
  cardAcknowledgments: string;
  cardSubCategory: string;
  cardReferences: string;
  cardLicense?: string;
  rubricTitle: string;
  rubricFacultyNotes: string;
  facultyHandout: Pick<
    DistributionDocument,
    "id" | "title" | "filename" | "body" | "notes"
  >;
}

export function withExportSurfaces(
  design: EmcureDesign,
  options: ExportSurfaceOptions,
): EmcureDesign {
  const drafted = draftCardFromDesign(design);
  const card = {
    ...drafted,
    summary: generateCardSummary(drafted),
    acknowledgments: options.cardAcknowledgments,
    subCategory: options.cardSubCategory,
    references: options.cardReferences,
    license: options.cardLicense ?? "CC BY-NC-SA 4.0",
  };
  return {
    ...design,
    card,
    rubric: {
      title: options.rubricTitle,
      kind: "both",
      audience: "both",
      body: draftRubricFromDesign(design, {
        title: options.rubricTitle,
        kind: "both",
        audience: "both",
        body: "",
        facultyNotes: "",
      }),
      facultyNotes: options.rubricFacultyNotes,
    },
    studentPackageOptions: {
      includeBrief: true,
      includeActivities: true,
      includeSuccessCriteria: true,
      includeMvrc: true,
      includeRubric: true,
    },
    distributionDocuments: [
      {
        id: options.facultyHandout.id,
        title: options.facultyHandout.title,
        audience: "faculty",
        kind: "handout",
        filename: options.facultyHandout.filename,
        mimeType: "text/markdown",
        body: options.facultyHandout.body,
        notes: options.facultyHandout.notes,
      },
    ],
  };
}
