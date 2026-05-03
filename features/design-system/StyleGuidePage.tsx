import { colorTokens, designSystemMeta, typographyTokens } from "./tokens";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-black pt-8">
      <div className="mb-8">
        <p
          className="mb-3"
          style={{
            color: "#4073FF",
            fontFamily: "var(--font-inter), Inter, Helvetica, Arial, sans-serif",
            fontSize: "18px",
            fontWeight: 500,
            letterSpacing: "0.18px",
            lineHeight: "26px",
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            color: "#000000",
            fontFamily: "var(--font-inter), Inter, Helvetica, Arial, sans-serif",
            fontSize: "18px",
            fontWeight: 500,
            letterSpacing: "0.18px",
            lineHeight: "26px",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function StyleGuidePage() {
  return (
    <main className="min-h-screen bg-white px-11 py-16 text-black">
      <div className="max-w-[720px]">
        <header className="mb-14">
          <p
            style={{
              color: "#4073FF",
              fontFamily: "var(--font-inter), Inter, Helvetica, Arial, sans-serif",
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "0.18px",
              lineHeight: "26px",
            }}
          >
            Internal style guide
          </p>
          <h1
            className="mt-8"
            style={{
              color: "#000000",
              fontFamily: "var(--font-eb-garamond), EB Garamond, Georgia, serif",
              fontSize: "50px",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {designSystemMeta.name}
          </h1>
          <p
            className="mt-5 max-w-[560px]"
            style={{
              color: "#7F7973",
              fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              letterSpacing: "0.18px",
              lineHeight: "26px",
            }}
          >
            {designSystemMeta.status}
          </p>
        </header>

        <Section eyebrow="Colors" title="Colors">
          <div className="flex flex-wrap gap-4">
            {colorTokens.map((token) => (
              <article key={`${token.nodeId}-${token.value}`} className="w-[90px]">
                <div className="size-[74px]" style={{ backgroundColor: token.value }} />
                <p className="mt-3 font-mono text-[12px] leading-4 text-black">{token.value}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section eyebrow="Fonts" title="Font Types">
          <div className="space-y-10">
            {typographyTokens.map((token) => (
              <article key={token.nodeId}>
                <p className="mb-3 font-mono text-[12px] leading-4 text-black">{token.name}</p>
                <div className="flex flex-col gap-2">
                  <p
                    style={{
                      color: token.color,
                      fontFamily: token.fontFamily,
                      fontSize: token.size,
                      fontWeight: token.weight,
                      letterSpacing: token.letterSpacing,
                      lineHeight: token.lineHeight,
                    }}
                  >
                    {token.sample}
                  </p>
                  <p className="font-mono text-[12px] leading-4 text-black">
                    {token.fontFamily.split(",")[0].replace("var(--font-", "").replace(")", "")} /{" "}
                    {token.size} / {token.lineHeight} / {token.weight}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
