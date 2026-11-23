import { Link, NavLink } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* nav-centre: fixed opaque bar */}
      <header className="fixed top-0 inset-x-0 z-10 bg-bg border-b border-white/5"
              style={{ height: 'var(--nav)' }}>
        <div className="ts-wrap h-full flex items-center justify-between">
          {/* Logo + ring mark */}
          <Link to="/" className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-accent flex items-center justify-center"
                  aria-hidden>
              <span className="w-3 h-3 rounded-full bg-accent"></span>
            </span>
            <span className="text-[20px] font-[500] tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-display)' }}>Tetris</span>
          </Link>

          {/* Nav words — centre-aligned group */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/"
              end
              className={({ isActive }) =>
                `text-[15px] font-[500] transition-colors ${
                  isActive
                    ? 'text-ink border-b-2 border-accent pb-1'
                    : 'text-muted hover:text-ink'
                }`
              }
            >
              首页
            </NavLink>
            <NavLink to="/tetris"
              className={({ isActive }) =>
                `text-[15px] font-[500] transition-colors ${
                  isActive
                    ? 'text-ink border-b-2 border-accent pb-1'
                    : 'text-muted hover:text-ink'
                }`
              }
            >
              开始游戏
            </NavLink>
            <NavLink to="/about"
              className={({ isActive }) =>
                `text-[15px] font-[500] transition-colors ${
                  isActive
                    ? 'text-ink border-b-2 border-accent pb-1'
                    : 'text-muted hover:text-ink'
                }`
              }
            >
              关于
            </NavLink>
          </nav>

          {/* Main action button */}
          <Link to="/tetris" className="ts-btn ts-btn-primary text-sm !h-10 !px-5">
            开始游戏
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main id="top" className="pt-[var(--nav)]">
        {children}
      </main>

      {/* footer-dark — dark page step darker */}
      <footer className="bg-black/60 border-t border-white/5 mt-0">
        <div className="ts-wrap py-16">
          {/* Close row (close-word: h2 + button + name large) */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-0 justify-between">
              <div className="max-w-[600px]">
                <h2 className="text-[48px] leading-[1.02] tracking-[-0.03em] font-[500] mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}>
                  准备好挑战了吗？
                </h2>
                <p className="text-muted text-base">
                  经典玩法，现代界面。点一下按钮，消除你的第一行。
                </p>
              </div>
              <Link to="/tetris" className="ts-btn ts-btn-primary">
                开始游戏
              </Link>
            </div>
            {/* The name set large across wrap */}
            <p className="text-[12vw] font-[500] tracking-[-0.04em] leading-[0.9] text-white/10 mt-10 select-none"
               style={{ fontFamily: 'var(--font-display)' }}>
              TETRIS
            </p>
          </div>

          {/* Directory row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="text-ink font-[500] mb-3">导航</h3>
              <ul className="space-y-2 text-muted">
                <li><Link to="/" className="hover:text-ink transition-colors">首页</Link></li>
                <li><Link to="/tetris" className="hover:text-ink transition-colors">开始游戏</Link></li>
                <li><Link to="/about" className="hover:text-ink transition-colors">关于</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-ink font-[500] mb-3">玩法</h3>
              <ul className="space-y-2 text-muted">
                <li>← → 移动方块</li>
                <li>↑ 旋转</li>
                <li>↓ 加速下落</li>
                <li>空格 直接落底</li>
              </ul>
            </div>
            <div>
              <h3 className="text-ink font-[500] mb-3">技术</h3>
              <ul className="space-y-2 text-muted">
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Tailwind CSS v4</li>
                <li>Vite</li>
              </ul>
            </div>
            <div>
              <h3 className="text-ink font-[500] mb-3">关于</h3>
              <p className="text-muted leading-[1.6]">
                一个用 React + TS 打造的俄罗斯方块，作为 Web 应用框架的展示站。
              </p>
            </div>
          </div>

          {/* Legal row */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted">
            <span>© {new Date().getFullYear()} Tetris Web App</span>
            <span>Photographs via Unsplash</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
