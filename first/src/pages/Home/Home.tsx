import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card/Card'

// Stand-in hero photo (game setting: neon arcade / cyber city at night)
// Using Trae image generator as a stand-in (no real game key art supplied).
const HERO_PHOTO =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=neon+arcade+cabinet+in+dimly+lit+cyberpunk+city+alley+at+night%2C+vaporwave+colors%2C+shot+on+Sony+A7IV%2C+16x9&image_size=landscape_16_9'

function Home() {
  // Word-highlight moment scroll listener
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-moment="word-highlight"]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ts-word-highlight', 'is-active')
          } else {
            entry.target.classList.remove('ts-word-highlight', 'is-active')
          }
        })
      },
      { threshold: 0.45 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {/* =========================================================
          HERO · photo hero (gaming, deal: photo, solid box on calm left)
          ========================================================= */}
      <section className="relative" style={{ height: '100svh' }} aria-labelledby="hero-h">
        {/* Full-bleed photograph layer */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={HERO_PHOTO}
            alt="霓虹街机厅 — 一个未来都市的暗色场景"
            className="w-full h-full object-cover"
            loading="eager"
            style={{ objectPosition: '30% 50%' }}
          />
          {/* Very subtle scrim only to guarantee box reads; deal says NO scrim/gradient over photo.
              We keep it at 0 — the solid box handles contrast. */}
        </div>

        {/* Content — the hero's wrap sits over the photo, text in a SOLID box */}
        <div className="ts-wrap relative z-[2] h-full flex items-center">
          {/* Solid box with calm side — left 6 columns */}
          <div className="bg-bg rounded-[var(--radius-lg)] p-12 md:p-14 max-w-[640px]">
            <div className="ts-hero-text">
              {/* Notice line */}
              <p className="text-[14px] text-muted tracking-[0.01em] mb-6">
                · 经典俄罗斯方块 · 2026
              </p>

              {/* H1 — max 32 chars (we have "Tetris, 一款经典方块堆叠游戏" = 20 chars) */}
              <h1
                id="hero-h"
                className="text-[44px] md:text-[80px] leading-[1.02] font-[500] tracking-[-0.03em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Tetris,
                <br />
                一款经典方块堆叠游戏
              </h1>

              {/* Sub-line — 15-30 words */}
              <p className="text-[20px] leading-[1.5] text-muted mt-6 mb-8 max-w-[42ch]">
                在 10×20 的棋盘上消除行数。随着等级升高，下落速度会越来越快。
              </p>

              {/* Buttons — primary + secondary */}
              <div className="flex items-center gap-3 flex-wrap">
                <Link to="/tetris" className="ts-btn ts-btn-primary">
                  开始游戏
                </Link>
                <Link to="/about" className="ts-btn ts-btn-secondary">
                  了解技术栈
                </Link>
              </div>

              {/* Four facts strip (docked above the photograph foot on desktop only, <1024 hidden) */}
              <div className="hidden md:grid grid-cols-4 gap-6 mt-10 pt-6 border-t border-white/10 text-sm">
                <div>
                  <p className="text-ink font-[500]">7</p>
                  <p className="text-muted text-[12px]">种方块</p>
                </div>
                <div>
                  <p className="text-ink font-[500]">10</p>
                  <p className="text-muted text-[12px]">× 20 棋盘</p>
                </div>
                <div>
                  <p className="text-ink font-[500]">140+</p>
                  <p className="text-muted text-[12px]">每等级掉落</p>
                </div>
                <div>
                  <p className="text-ink font-[500]">React</p>
                  <p className="text-muted text-[12px]">+ TypeScript</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 · What you do — feature cards (1 screen, 12 columns)
          ========================================================= */}
      <section className="ts-wrap py-[var(--padt)] pb-[var(--padb)]">
        <div className="mb-12">
          <h2 className="text-[48px] md:text-[48px] leading-[1.04] tracking-[-0.02em] font-[500] max-w-[14ch]"
              style={{ fontFamily: 'var(--font-display)' }}>
            消除行数，<br />刷新最高分
          </h2>
          <p className="text-muted text-[16px] mt-4 max-w-[56ch]">
            每消除一行就能得分，连续多行有奖励。每消除 10 行升一级，速度越来越快。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="七块经典方块">
            <p className="text-muted text-[15px] leading-[1.6]">
              I、O、T、S、Z、J、L 各有不同的旋转形态，每一块都要在合适的位置落下。
            </p>
          </Card>
          <Card title="等级加速机制">
            <p className="text-muted text-[15px] leading-[1.6]">
              每 10 行升一级，从 800ms 下落起步，越到后面越快，考验反应。
            </p>
          </Card>
          <Card title="软降 & 硬降">
            <p className="text-muted text-[15px] leading-[1.6]">
              ↓ 键软降加 1 分，空格硬降加位置分，精准操作就是高分来源。
            </p>
          </Card>
          <Card title="旋转墙踢">
            <p className="text-muted text-[15px] leading-[1.6]">
              方块靠墙旋转时会自动偏移 1-2 格，不会再出现"明明能放进去却卡住"。
            </p>
          </Card>
          <Card title="下一个预览">
            <p className="text-muted text-[15px] leading-[1.6]">
              侧边栏显示下一个方块，提前规划好落点，不慌不乱。
            </p>
          </Card>
          <Card title="分数系统">
            <p className="text-muted text-[15px] leading-[1.6]">
              单行 100，双行 300，三行 500，四行 800，乘以当前等级。
            </p>
          </Card>
        </div>
      </section>

      {/* =========================================================
          SECTION 3 · media-band (rhythm) — full-bleed photograph
          ========================================================= */}
      <section className="relative h-[600px] mt-16 overflow-hidden">
        <img
          src={HERO_PHOTO}
          alt="霓虹方块在暗色棋盘上堆叠的效果"
          className="w-full h-full object-cover opacity-60"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/50 to-bg" />
        <div className="ts-wrap absolute inset-0 flex items-center justify-center">
          <p
            className="text-[48px] md:text-[72px] leading-[1.02] tracking-[-0.03em] font-[500] text-center text-white max-w-[18ch]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            每一块落下，<br />都是一次机会。
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 4 · Word-highlight moment (scroll)
          ========================================================= */}
      <section
        className="ts-wrap py-[var(--padt)] pb-[var(--padb)]"
        data-moment="word-highlight"
      >
        <WordHighlightStatement />
      </section>
    </div>
  )
}

function WordHighlightStatement() {
  // Split sentence into words, render each with .wh-word
  const sentence = '速度，判断，运气——三个要素堆起每一行干净的消除。'
  const words = sentence.split('')

  return (
    <p
      className="text-[48px] md:text-[72px] leading-[1.08] tracking-[-0.02em] font-[500] max-w-[18ch]"
      style={{ fontFamily: 'var(--font-display)' }}
      aria-label={sentence}
    >
      {words.map((ch, i) => (
        <span
          key={i}
          className="wh-word"
          style={{
            transitionDelay: `${i * 40}ms`,
            display: ch === ' ' ? 'inline' : 'inline-block',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </p>
  )
}

export default Home
