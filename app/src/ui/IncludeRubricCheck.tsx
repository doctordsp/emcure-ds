export function IncludeRubricCheck({
  hasRubric,
  checked,
  onChange,
}: {
  hasRubric: boolean;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className={`inline-check${hasRubric ? "" : " is-disabled"}`}>
      <input
        type="checkbox"
        disabled={!hasRubric}
        checked={hasRubric && checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{hasRubric ? "Include rubric" : "Include rubric (none yet)"}</span>
    </label>
  );
}
