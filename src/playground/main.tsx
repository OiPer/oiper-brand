import { ReactNode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  OiPerAnimatedLogo,
  OiPerLogo,
  OiPerLogoBackground,
  OiPerLogoCompact,
  OiPerLogoText,
  OiPerText,
} from '..'

const VARIANTS = ['draw', 'shine', 'wipe', 'trace'] as const
const SIZES = [16, 48, 128]

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 14, fontWeight: 500, opacity: 0.6 }}>{label}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {children}
      </div>
    </section>
  )
}

function App() {
  const [replay, setReplay] = useState(0)

  return (
    <main style={{ padding: 32 }}>
      <h1 style={{ fontSize: 18 }}>Logos</h1>

      <Item label="OiPerLogo">
        {SIZES.map((size) => (
          <OiPerLogo key={size} style={{ fontSize: size }} />
        ))}
      </Item>
      <Item label="OiPerLogoCompact">
        {SIZES.map((size) => (
          <OiPerLogoCompact key={size} style={{ fontSize: size }} />
        ))}
      </Item>
      <Item label="OiPerLogoBackground">
        {SIZES.map((size) => (
          <OiPerLogoBackground key={size} style={{ fontSize: size }} />
        ))}
      </Item>
      <Item label="OiPerText">
        <OiPerText style={{ width: 'auto', height: 48 }} />
      </Item>
      <Item label="OiPerLogoText">
        <OiPerLogoText style={{ width: 'auto', height: 48 }} />
      </Item>

      <h1 style={{ marginTop: 48, fontSize: 18 }}>Animated logos</h1>
      <button onClick={() => setReplay((value) => value + 1)}>Replay</button>

      {VARIANTS.map((variant) => (
        <Item key={variant} label={`OiPerAnimatedLogo variant="${variant}"`}>
          {SIZES.map((size) => (
            <OiPerAnimatedLogo
              key={`${replay}-${size}`}
              variant={variant}
              style={{ fontSize: size }}
            />
          ))}
          <OiPerAnimatedLogo
            key={`${replay}-brand`}
            variant={variant}
            brandColor="#f5c451"
            style={{ fontSize: 128 }}
          />
        </Item>
      ))}
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
