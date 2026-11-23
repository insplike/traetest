import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card/Card'

function About() {
  // Word-highlight listener for moment section (reuse from Home)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-active')
          } else {
            entry.target.classList.remove('is-active')
          }
        })
      },
      { threshold: 0.4 },
    )
    document.querySelectorAll('.ts-word-highlight').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const stack = [
    { name: 'React', ver: '18.x', desc: '声明式 UI + Hooks 状态管理' },
    { name: 'TypeScript', ver: '5.x', desc: '类型安全，开发体验友好' },
    { name: 'Vite', ver: '6.x', desc: '极速构建 + 热更新' },
    { name: 'Tailwind CSS', ver: '4.x', desc: '原子化 CSS，@theme 令牌' },
    { name: 'React Router', ver: '6.x', desc: '声明式路由' },
    { name: 'Taste-skill', ver: '2.5', desc: '设计 deal 流程 · gaming kind' },
  ]

  return (
    <div className="ts-wrap py-[var(--padt)] pb-[var(--padb)] max-w-[1040px]">
      {/* Page head */}
      <div className="mb-14">
        <p className="text-[14px] text-muted mb-4 tracking-[0.01em]">· 关于</p>
        <h1 className="text-[48px] md:text-[56px] leading-[1.04] tracking-[-0.03em] font-[500] max-w-[14ch]"
            style={{ fontFamily: 'var(--font-display)' }}>
          一个用 React 堆起来的<br />俄罗斯方块展示站
        </h1>
        <p className="text-muted text-[17px] leading-[1.6] mt-6 max-w-[56ch]">
          这个站点同时是一个 Web 应用框架的展示 —— 单页内路由、组件化架构、
          Tailwind 设计令牌、以及 taste-skill deal 流程产出的 gaming 设计决策。
        </p>
      </div>

      {/* About section 1: what */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-surface border border-white/5 rounded-[var(--radius-md)] p-8">
          <h2 className="text-[20px] font-[500] mb-3"
              style={{ fontFamily: 'var(--font-display)' }}>游戏核心</h2>
          <p className="text-muted text-[15px] leading-[1.7]">
            useReducer 驱动的游戏状态机：board / piece / next / score / lines / level / status，
            重力下落、碰撞检测、消行计分、墙踢旋转——全部在约 200 行代码里实现。
          </p>
        </div>
        <div className="bg-surface border border-white/5 rounded-[var(--radius-md)] p-8">
          <h2 className="text-[20px] font-[500] mb-3"
              style={{ fontFamily: 'var(--font-display)' }}>设计系统</h2>
          <p className="text-muted text-[15px] leading-[1.7]">
            通过 taste-skill 的 deal 流程选出 lunar-grey-bronze 调色板和 Mona Sans 字体，
            12 列网格、统一圆角、solid 按钮、hover/press 微交互——全站一个系统。
          </p>
        </div>
      </div>

      {/* Tech stack */}
      <div className="mb-16">
        <h2 className="text-[32px] font-[500] mb-8 tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)' }}>技术栈</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stack.map((t) => (
            <div key={t.name} className="bg-surface border border-white/5 rounded-[var(--radius-sm)] p-5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[18px] font-[500] text-ink"
                      style={{ fontFamily: 'var(--font-display)' }}>{t.name}</span>
                <span className="text-[12px] text-muted"
                      style={{ fontFamily: 'var(--font-mono)' }}>{t.ver}</span>
              </div>
              <p className="text-[13px] text-muted mt-1 leading-[1.5]">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Design deal snapshot */}
      <Card title="本次 deal 产出" className="mb-16">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[15px]">
          <dt className="text-muted">kind</dt>
          <dd className="text-ink font-[500]" style={{ fontFamily: 'var(--font-mono)' }}>gaming</dd>

          <dt className="text-muted">palette</dt>
          <dd className="text-ink" style={{ fontFamily: 'var(--font-mono)' }}>
            lunar-grey-bronze — bg #111 / surface #1c / ink #f2 / accent #a08672
          </dd>

          <dt className="text-muted">type</dt>
          <dd className="text-ink">Mona Sans (500) + Geist Mono</dd>

          <dt className="text-muted">hero</dt>
          <dd className="text-ink">photo — full-bleed + solid box 文字</dd>

          <dt className="text-muted">nav</dt>
          <dd className="text-ink">nav-centre — 固定 opaque bar</dd>

          <dt className="text-muted">moment</dt>
          <dd className="text-ink">word-highlight — 滚动逐词变亮</dd>

          <dt className="text-muted">buttons</dt>
          <dd className="text-ink">solid</dd>

          <dt className="text-muted">mark</dt>
          <dd className="text-ink">ring</dd>
        </dl>
      </Card>

      {/* Call to action */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-8 border-t border-white/5">
        <p className="text-muted">准备好开始了吗？</p>
        <Link to="/tetris" className="ts-btn ts-btn-primary">
          开始游戏
        </Link>
      </div>
    </div>
  )
}

export default About
