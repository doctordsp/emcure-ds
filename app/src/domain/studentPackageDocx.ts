import {
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  type FileChild,
} from "docx";
import { displayTitle } from "./createDesign";
import { isTableDivider, isTableRow, splitCells } from "./rubric";
import { studentPackageMarkdown } from "./studentPackage";
import type { EmcureDesign } from "./types";

const TEAL = "125670";
const HEADER_FILL = "DCEBF0";
const BORDER = "CBD8DD";
const PAGE_DXA = 10080;

function inlineRuns(text: string, size?: number): TextRun[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((part) => part.length > 0);
  if (parts.length === 0) return [new TextRun({ text: "", size })];
  return parts.map((part) => {
    const bold = part.startsWith("**") && part.endsWith("**") && part.length >= 4;
    return new TextRun({
      text: bold ? part.slice(2, -2) : part,
      bold: bold || undefined,
      size,
    });
  });
}

function heading(level: (typeof HeadingLevel)[keyof typeof HeadingLevel], text: string, before: number, after: number) {
  return new Paragraph({
    heading: level,
    spacing: { before, after, line: 276 },
    children: [new TextRun({ text, color: TEAL, bold: true })],
  });
}

function tableCell(text: string, header: boolean, width: number): TableCell {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: header ? { type: ShadingType.CLEAR, fill: HEADER_FILL } : undefined,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    children: [
      new Paragraph({
        spacing: { after: 0, line: 240 },
        children: inlineRuns(text, header ? 16 : 16),
      }),
    ],
  });
}

function markdownTable(rows: string[][]): Table {
  const cols = Math.max(...rows.map((row) => row.length), 1);
  const width = Math.floor(PAGE_DXA / cols);
  const borders = {
    color: BORDER,
    style: BorderStyle.SINGLE,
    size: 4,
  };
  return new Table({
    width: { size: PAGE_DXA, type: WidthType.DXA },
    columnWidths: Array.from({ length: cols }, () => width),
    rows: rows.map(
      (row, index) =>
        new TableRow({
          tableHeader: index === 0,
          children: Array.from({ length: cols }, (_, col) =>
            tableCell(row[col] ?? "", index === 0, width),
          ),
        }),
    ),
    borders: {
      top: borders,
      bottom: borders,
      left: borders,
      right: borders,
      insideHorizontal: borders,
      insideVertical: borders,
    },
  });
}

/** Exported for tests. */
export function fileChildrenFromMarkdown(markdown: string): FileChild[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: FileChild[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (isTableRow(line) && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        if (!isTableDivider(lines[i])) rows.push(splitCells(lines[i]));
        i += 1;
      }
      if (rows.length) out.push(markdownTable(rows));
      continue;
    }
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    if (line.startsWith("# ")) {
      out.push(heading(HeadingLevel.HEADING_1, line.slice(2), 0, 200));
    } else if (line.startsWith("## ")) {
      out.push(heading(HeadingLevel.HEADING_2, line.slice(3), 360, 160));
    } else if (line.startsWith("### ")) {
      out.push(heading(HeadingLevel.HEADING_3, line.slice(4), 280, 120));
    } else if (line.startsWith("#### ")) {
      out.push(heading(HeadingLevel.HEADING_4, line.slice(5), 240, 120));
    } else if (line.startsWith("- ")) {
      out.push(
        new Paragraph({
          spacing: { after: 80, line: 276 },
          children: inlineRuns(line.slice(2)),
          bullet: { level: 0 },
        }),
      );
    } else if (line.startsWith("---")) {
      out.push(
        new Paragraph({
          spacing: { before: 200, after: 200 },
          border: {
            bottom: { color: "C8D3D8", space: 1, style: BorderStyle.SINGLE, size: 12 },
          },
        }),
      );
    } else {
      out.push(
        new Paragraph({
          spacing: { after: 200, line: 276 },
          children: inlineRuns(line),
        }),
      );
    }
    i += 1;
  }
  return out;
}

function studentHandoutDocument(design: EmcureDesign): Document {
  return new Document({
    creator: "EM-CURE Design Studio",
    title: `${displayTitle(design)} student handout`,
    description: "Draft student handout. Edit after you download.",
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children: fileChildrenFromMarkdown(studentPackageMarkdown(design)),
      },
    ],
  });
}

export async function studentPackageDocx(design: EmcureDesign): Promise<Blob> {
  return Packer.toBlob(studentHandoutDocument(design));
}

export async function studentPackageDocxBuffer(design: EmcureDesign): Promise<Uint8Array> {
  const buffer = await Packer.toBuffer(studentHandoutDocument(design));
  return new Uint8Array(buffer);
}
