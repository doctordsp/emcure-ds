import { parseCardProseBlock, splitCardProse } from "../domain/cardProse";

export function CardProse({ text }: { text: string }) {
  const blocks = splitCardProse(text);
  if (blocks.length === 0) return null;
  return (
    <div className="card-prose">
      {blocks.map((block, index) => {
        const parsed = parseCardProseBlock(block);
        return (
          <p key={index}>
            {parsed.name ? (
              <>
                <strong>{parsed.name}</strong>
                {parsed.meta ? ` (${parsed.meta})` : null}
                {parsed.body ? `: ${parsed.body}` : null}
              </>
            ) : (
              parsed.body
            )}
          </p>
        );
      })}
    </div>
  );
}
