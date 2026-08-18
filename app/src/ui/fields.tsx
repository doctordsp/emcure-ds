import type { ReactNode } from "react";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
  wide?: boolean;
}

export function Field({ id, label, hint, children, wide }: FieldProps) {
  return (
    <div className={wide ? "field field-wide" : "field"}>
      <label htmlFor={id}>{label}</label>
      {hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  );
}

interface TextInputProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  wide?: boolean;
}

export function TextInput({
  id,
  label,
  hint,
  value,
  onChange,
  type = "text",
  wide,
}: TextInputProps) {
  return (
    <Field id={id} label={label} hint={hint} wide={wide}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
    </Field>
  );
}

interface NumberInputProps {
  id: string;
  label: string;
  hint?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function NumberInput({ id, label, hint, value, onChange }: NumberInputProps) {
  return (
    <Field id={id} label={label} hint={hint}>
      <input
        id={id}
        type="number"
        min={0}
        value={value ?? ""}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === "" ? undefined : Number(next));
        }}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
    </Field>
  );
}

interface TextAreaProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  wide?: boolean;
}

export function TextArea({
  id,
  label,
  hint,
  value,
  onChange,
  rows = 4,
  wide,
}: TextAreaProps) {
  return (
    <Field id={id} label={label} hint={hint} wide={wide}>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
    </Field>
  );
}

interface SelectProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ id, label, hint, value, onChange, options }: SelectProps) {
  return (
    <Field id={id} label={label} hint={hint}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

interface ChecklistProps {
  legend: string;
  hint?: string;
  items: { id: string; label: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function Checklist({ legend, hint, items, selected, onChange }: ChecklistProps) {
  if (items.length === 0) {
    return <p className="muted">{legend}: none available yet.</p>;
  }
  return (
    <fieldset className="field field-wide">
      <legend className="legend">{legend}</legend>
      {hint ? <p className="field-hint">{hint}</p> : null}
      <div className="checkbox-grid">
        {items.map((item) => {
          const checked = selected.includes(item.id);
          return (
            <label key={item.id} className="inline-check">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  onChange(
                    checked
                      ? selected.filter((id) => id !== item.id)
                      : [...selected, item.id],
                  );
                }}
              />
              <span>{item.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

