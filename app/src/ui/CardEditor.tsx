import { useEffect, useRef, useState } from "react";
import { cardAiRewriteEnabled } from "../ai/featureFlags";
import { useAuth } from "../auth/AuthContext";
import {
  CARD_COMPONENTS,
  CARD_EM_OUTCOMES,
  CARD_FORMATS,
  CARD_STAGES,
  FEATURED_IMAGE_MAX_BYTES,
  FEATURED_IMAGE_TYPES,
  YEAR_LEVELS,
  canFillCardField,
  cardDisplayId,
  cardFillSource,
  cardToHtml,
  cardToMarkdown,
  draftCardFromDesign,
  fillCardField,
  generateCardSummary,
  resolvedCard,
  type CardFillField,
} from "../domain/card";
import { assetTooLargeMessage, MAX_ASSET_BYTES } from "../domain/files";
import { displayTitle } from "../domain/createDesign";
import { createId } from "../domain/ids";
import { studentFacingDocuments } from "../domain/studentPackage";
import type { DistributionDocument, EmcureDesign } from "../domain/types";
import { resolveCardImageSrc, uploadDesignAsset } from "../persistence/assets";
import { downloadTextFile } from "../persistence/storage";
import { AiRewriteSuggestion } from "./AiRewriteSuggestion";
import { useDesign } from "./DesignContext";
import { Checklist, SelectField, TagPills, TextArea, TextInput } from "./fields";
import { PublishCardPanel } from "./PublishCardPanel";

export function CardEditor({ onOpenStudentDocuments }: { onOpenStudentDocuments: () => void }) {
  const { design, update } = useDesign();
  const { user } = useAuth();
  const card = resolvedCard(design);
  const fileRef = useRef<HTMLInputElement>(null);
  const assetRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [assetError, setAssetError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | undefined>(card.featuredImageDataUrl);
  const slug = displayTitle(design).replace(/[^\w]+/g, "-").toLowerCase() || "emcure";
  const studentDocs = studentFacingDocuments(design);

  useEffect(() => {
    let cancelled = false;
    void resolveCardImageSrc({
      dataUrl: card.featuredImageDataUrl,
      path: card.featuredImagePath,
    }).then((src) => {
      if (!cancelled) setImageSrc(src);
    });
    return () => {
      cancelled = true;
    };
  }, [card.featuredImageDataUrl, card.featuredImagePath]);

  function patch(partial: Partial<typeof card>) {
    update((current) => ({
      ...current,
      card: { ...resolvedCard(current), ...partial },
    }));
  }

  function fill(field: CardFillField) {
    update((current) => ({
      ...current,
      card: fillCardField(resolvedCard(current), current, field),
    }));
  }

  function fillAction(field: CardFillField) {
    return <FillFromDesign design={design} field={field} onFill={fill} />;
  }

  function onImage(file: File | undefined) {
    setImageError(null);
    if (!file) return;
    if (!FEATURED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Use a JPG, PNG, or GIF.");
      return;
    }
    if (file.size > FEATURED_IMAGE_MAX_BYTES) {
      setImageError(assetTooLargeMessage("featured image"));
      return;
    }
    if (user) {
      void uploadDesignAsset({
        userId: user.id,
        designId: design.id,
        folder: "card",
        blob: file,
        filename: file.name,
      })
        .then((path) => {
          patch({
            featuredImageName: file.name,
            featuredImagePath: path,
            featuredImageDataUrl: undefined,
          });
        })
        .catch((caught: unknown) => {
          setImageError(caught instanceof Error ? caught.message : "Could not upload the image.");
        });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      patch({
        featuredImageName: file.name,
        featuredImageDataUrl: String(reader.result),
        featuredImagePath: undefined,
      });
    };
    reader.readAsDataURL(file);
  }

  function onAsset(file: File | undefined) {
    setAssetError(null);
    if (!file) return;
    if (file.size > MAX_ASSET_BYTES) {
      setAssetError(assetTooLargeMessage());
      return;
    }
    const addDoc = (partial: Pick<DistributionDocument, "dataUrl" | "storagePath">) => {
      const next: DistributionDocument = {
        id: createId(),
        title: file.name.replace(/\.[^.]+$/, ""),
        audience: "students",
        kind: "uploaded",
        body: "",
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        ...partial,
      };
      update((current) => ({
        ...current,
        distributionDocuments: [...(current.distributionDocuments ?? []), next],
      }));
    };
    if (user) {
      void uploadDesignAsset({
        userId: user.id,
        designId: design.id,
        folder: "assets",
        blob: file,
        filename: file.name,
      })
        .then((storagePath) => addDoc({ storagePath }))
        .catch((caught: unknown) => {
          setAssetError(caught instanceof Error ? caught.message : "Could not upload the file.");
        });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => addDoc({ dataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  const outcomeGroups = ["Curiosity", "Connections", "Creating Value"] as const;

  return (
    <div className="eu-card">
      <p className="muted">
        Card {cardDisplayId(design.id)}. Prefills from this EM-CURE. Use <strong>Fill from design</strong>{" "}
        on a field to refresh that field only. Edit anything that should appear on a public card; the
        studio design itself does not change.
        {cardAiRewriteEnabled()
          ? " Suggest rewrite is on for Description, Problem / Need, and Summary. Accept, edit, or dismiss; the field is never overwritten on arrival."
          : ""}
      </p>
      <div className="card-actions" style={{ marginTop: 0 }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => downloadTextFile(`${slug}-card.html`, cardToHtml(design), "text/html")}
        >
          Download card HTML
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => downloadTextFile(`${slug}-card.md`, cardToMarkdown(design), "text/markdown")}
        >
          Download card Markdown
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() =>
            update((current) => ({
              ...current,
              card: {
                ...draftCardFromDesign(current),
                author: resolvedCard(current).author,
                featuredImageName: resolvedCard(current).featuredImageName,
                featuredImageDataUrl: resolvedCard(current).featuredImageDataUrl,
                featuredImagePath: resolvedCard(current).featuredImagePath,
              },
            }))
          }
        >
          Reset fields from design
        </button>
      </div>
      <PublishCardPanel />

      <TextInput
        id="card-title"
        label="Title"
        value={card.title}
        onChange={(title) => patch({ title })}
        action={fillAction("title")}
        wide
      />
      <TextInput
        id="card-author"
        label="Author"
        hint="Appears as “by …” on the card. Prefills from Instructor."
        value={card.author}
        onChange={(author) => patch({ author })}
        action={fillAction("author")}
      />
      <TextInput
        id="card-institution"
        label="Institution"
        value={card.institution ?? ""}
        onChange={(institution) => patch({ institution })}
        action={fillAction("institution")}
      />
      <TextInput
        id="card-department"
        label="Department"
        value={card.department ?? ""}
        onChange={(department) => patch({ department })}
        action={fillAction("department")}
      />
      <TextInput
        id="card-instructor"
        label="Instructor"
        hint="Used to filter the Public Gallery. Separate from the Author byline."
        value={card.instructor ?? ""}
        onChange={(instructor) => patch({ instructor })}
        action={fillAction("instructor")}
      />

      <div className="eu-section">
        <label className="legend" htmlFor="card-image">
          Featured image
        </label>
        <p className="field-hint">
          Recommended size 1200×630. Minimum 600×315. Aspect ratio 1.91:1. JPG, PNG, or GIF.
          Keep files under 2 MB.
        </p>
        <button
          type="button"
          className="image-dropzone"
          onClick={() => fileRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            onImage(event.dataTransfer.files[0]);
          }}
        >
          {imageSrc ? (
            <img src={imageSrc} alt="" />
          ) : (
            <span>
              <strong>Upload an image</strong>
              <span className="muted">1200×630 · JPG, PNG, GIF</span>
            </span>
          )}
        </button>
        <input
          id="card-image"
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          hidden
          onChange={(event) => onImage(event.target.files?.[0])}
        />
        {(card.featuredImageName || card.featuredImagePath || card.featuredImageDataUrl) ? (
          <p className="muted">
            {card.featuredImageName || "Featured image"}{" "}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                patch({
                  featuredImageName: undefined,
                  featuredImageDataUrl: undefined,
                  featuredImagePath: undefined,
                })
              }
            >
              Remove
            </button>
          </p>
        ) : null}
        {imageError ? <p className="field-error">{imageError}</p> : null}
      </div>

      <SelectField
        id="card-year"
        label="Year level"
        value={card.yearLevel}
        onChange={(yearLevel) => patch({ yearLevel })}
        action={fillAction("yearLevel")}
        options={[
          { value: "", label: "Select year level" },
          ...YEAR_LEVELS.map((item) => ({ value: item.id, label: item.label })),
        ]}
      />
      <TextInput
        id="card-course"
        label="Course"
        value={card.course}
        onChange={(course) => patch({ course })}
        action={fillAction("course")}
        wide
      />
      <TextArea
        id="card-materials"
        label="Materials"
        hint="Starter from the course envelope and journey titles, not a lab supply list."
        value={card.materials}
        onChange={(materials) => patch({ materials })}
        action={fillAction("materials")}
        rows={3}
        wide
      />
      <AiRewriteSuggestion
        field="problemNeed"
        id="card-need"
        label="Problem / Need"
        value={card.problemNeed}
        onChange={(problemNeed) => patch({ problemNeed })}
        fillAction={fillAction("problemNeed")}
        rows={5}
        wide
      />
      <AiRewriteSuggestion
        field="description"
        id="card-description"
        label="Description"
        value={card.description}
        onChange={(description) => patch({ description })}
        fillAction={fillAction("description")}
        rows={6}
        wide
      />

      <div className="eu-section">
        <h2>EM Habits / KE</h2>
        <TextArea
          id="card-em-comments"
          label="Habits"
          hint="Selected studio habits and behaviors, plus any notes for the public card."
          value={card.emComments}
          onChange={(emComments) => patch({ emComments })}
          action={fillAction("emComments")}
          rows={5}
          wide
        />
      </div>

      <details className="eu-section" open>
        <summary>
          <span className="field-label-row">
            <h2>Educational outcomes</h2>
            {fillAction("emOutcomeIds")}
          </span>
        </summary>
        {outcomeGroups.map((group) => (
          <Checklist
            key={group}
            legend={group}
            items={CARD_EM_OUTCOMES.filter((item) => item.group === group).map((item) => ({
              id: item.id,
              label: item.label,
            }))}
            selected={card.emOutcomeIds}
            onChange={(emOutcomeIds) => patch({ emOutcomeIds })}
          />
        ))}
        <TextArea
          id="card-objectives"
          label="Learning objectives"
          value={card.learningObjectives}
          onChange={(learningObjectives) => patch({ learningObjectives })}
          action={fillAction("learningObjectives")}
          rows={5}
          wide
        />
      </details>

      <div className="eu-section">
        <h2>Programming</h2>
        <TagPills
          legend="Stages"
          options={[...CARD_STAGES]}
          selected={card.stages}
          onChange={(stages) => patch({ stages })}
          action={fillAction("stages")}
        />
        <TagPills
          legend="Components"
          options={[...CARD_COMPONENTS]}
          selected={card.components}
          onChange={(components) => patch({ components })}
          action={fillAction("components")}
        />
        <TagPills
          legend="Format"
          options={[...CARD_FORMATS]}
          selected={card.formats}
          onChange={(formats) => patch({ formats })}
          action={fillAction("formats")}
        />
      </div>

      <TextArea
        id="card-assessment"
        label="Assessment"
        value={card.assessment}
        onChange={(assessment) => patch({ assessment })}
        action={fillAction("assessment")}
        rows={5}
        wide
      />

      <details className="eu-section">
        <summary>
          <h2>Authoring details</h2>
        </summary>
        <TextArea
          id="card-ack"
          label="References and acknowledgments"
          value={card.acknowledgments}
          onChange={(acknowledgments) => patch({ acknowledgments })}
          rows={4}
          wide
        />
      </details>

      <details className="eu-section">
        <summary>
          <h2>Attributes</h2>
        </summary>
        <TextInput
          id="card-category"
          label="Category"
          value={card.category}
          onChange={(category) => patch({ category })}
          action={fillAction("category")}
        />
        <TextInput
          id="card-subcategory"
          label="Sub-category"
          value={card.subCategory}
          onChange={(subCategory) => patch({ subCategory })}
        />
        <TextInput
          id="card-references"
          label="Reference"
          value={card.references}
          onChange={(references) => patch({ references })}
          wide
        />
        <TextInput
          id="card-license"
          label="License"
          value={card.license}
          onChange={(license) => patch({ license })}
          wide
        />
      </details>

      <div className="eu-section">
        <h2>Resources</h2>
        <p className="field-hint">
          Files tagged for students are included in the student package. Write longer handouts on
          Student documents.
        </p>
        {studentDocs.length > 0 ? (
          <ul className="inventory-list">
            {studentDocs.map((doc) => (
              <li key={doc.id}>
                {doc.title || doc.filename} <span className="muted">({doc.filename})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No student files yet.</p>
        )}
        <div className="card-actions">
          <button type="button" className="btn btn-secondary" onClick={() => assetRef.current?.click()}>
            + Upload assets
          </button>
          <button type="button" className="btn btn-ghost" onClick={onOpenStudentDocuments}>
            Create student documents
          </button>
        </div>
        <input
          ref={assetRef}
          type="file"
          hidden
          onChange={(event) => {
            onAsset(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {assetError ? <p className="field-error">{assetError}</p> : null}
      </div>

      <div className="eu-section">
        <h2>Summary</h2>
        <AiRewriteSuggestion
          field="summary"
          id="card-summary"
          label="Summary"
          hint="Fill from design uses the studio. Generate summary uses the card fields as they stand now."
          value={card.summary}
          onChange={(summary) => patch({ summary })}
          fillAction={fillAction("summary")}
          rows={5}
          wide
        />
        <button
          type="button"
          className="btn btn-gold"
          onClick={() => patch({ summary: generateCardSummary(card) })}
        >
          Generate summary
        </button>
      </div>
    </div>
  );
}

function FillFromDesign({
  design,
  field,
  onFill,
}: {
  design: EmcureDesign;
  field: CardFillField;
  onFill: (field: CardFillField) => void;
}) {
  const enabled = canFillCardField(design, field);
  const source = cardFillSource(field);
  return (
    <button
      type="button"
      className="btn-fill"
      disabled={!enabled}
      title={enabled ? source : `Nothing to fill, ${source}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onFill(field);
      }}
    >
      Fill from design
    </button>
  );
}
