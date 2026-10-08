import { createRoot } from 'react-dom/client'
import {
  OiPerLogo,
  OiPerLogoBackground,
  OiPerLogoCompact,
  OiPerLogoDraw,
  OiPerLogoShine,
  OiPerLogoText,
  OiPerLogoTrace,
  OiPerLogoWipe,
  OiPerText,
} from '..'

const ICON_SIZES = [16, 32, 64, 128]
const WORDMARK_HEIGHTS = [24, 48, 72]
const BRAND_COLOR = '#f5c451'

const ICONS = [
  { name: 'OiPerLogo', Logo: OiPerLogo },
  { name: 'OiPerLogoCompact', Logo: OiPerLogoCompact },
  { name: 'OiPerLogoBackground', Logo: OiPerLogoBackground },
]

const WORDMARKS = [
  { name: 'OiPerText', Logo: OiPerText },
  { name: 'OiPerLogoText', Logo: OiPerLogoText },
]

const ANIMATED = [
  { name: 'OiPerLogoDraw', Logo: OiPerLogoDraw },
  { name: 'OiPerLogoShine', Logo: OiPerLogoShine },
  { name: 'OiPerLogoWipe', Logo: OiPerLogoWipe },
  { name: 'OiPerLogoTrace', Logo: OiPerLogoTrace },
]

function IconsHead() {
  return (
    <div className="head">
      <span>Component</span>
      {ICON_SIZES.map((size) => (
        <span key={size}>{size}px</span>
      ))}
      <span>Brand color</span>
    </div>
  )
}

function App() {
  return (
    <div className="page">
      <header>
        <h1>OiPer Logo</h1>
        <p className="lede">All logo components at different sizes.</p>
      </header>

      <section>
        <h2>Icons</h2>
        <div className="grid icons">
          <IconsHead />
          {ICONS.map((icon) => (
            <div key={icon.name}>
              <code>{icon.name}</code>
              {ICON_SIZES.map((size) => (
                <span key={size}>
                  <icon.Logo style={{ fontSize: size }} />
                </span>
              ))}
              <span>
                <icon.Logo brandColor={BRAND_COLOR} style={{ fontSize: 64 }} />
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Wordmarks</h2>
        <div className="grid wordmarks">
          <div className="head">
            <span>Component</span>
            {WORDMARK_HEIGHTS.map((height) => (
              <span key={height}>{height}px</span>
            ))}
          </div>
          {WORDMARKS.map((wordmark) => (
            <div key={wordmark.name}>
              <code>{wordmark.name}</code>
              {WORDMARK_HEIGHTS.map((height) => (
                <span key={height}>
                  <wordmark.Logo style={{ width: 'auto', height }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Animated</h2>
        <div className="grid icons">
          <IconsHead />
          {ANIMATED.map((icon) => (
            <div key={icon.name}>
              <code>{icon.name}</code>
              {ICON_SIZES.map((size) => (
                <span key={size}>
                  <icon.Logo style={{ fontSize: size }} />
                </span>
              ))}
              <span>
                <icon.Logo brandColor={BRAND_COLOR} style={{ fontSize: 64 }} />
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
