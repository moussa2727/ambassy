// components/Ticker.tsx
export default function Ticker() {
  const tickerItems = [
    "Astro 5.0 est sorti",
    "Tailwind v5 avec Oxide Engine",
    "Next.js 15 : les nouveautés",
    "React 20 en preview",
    "Web Components en 2026",
    "Vercel Edge Functions",
    "Deno 3 stable"
  ]

  return (
    <div className="bg-[#0d2818] text-[#8ab89a] text-[0.7rem] font-medium tracking-widest uppercase py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-[ticker_30s_linear_infinite]">
        {tickerItems.map((item, index) => (
          <span key={index}>
            ✦ {item} &nbsp;&nbsp;&nbsp;
          </span>
        ))}
        {tickerItems.map((item, index) => (
          <span key={`dup-${index}`}>
            ✦ {item} &nbsp;&nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  )
}