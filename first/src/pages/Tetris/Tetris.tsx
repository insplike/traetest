import { useEffect, useReducer } from 'react'

const COLS = 10
const ROWS = 20

type Cell = string | null
type Board = Cell[][]

interface Piece {
  type: string
  matrix: number[][]
  color: string
  x: number
  y: number
}

type PieceData = Omit<Piece, 'x' | 'y'>

type Status = 'ready' | 'playing' | 'paused' | 'over'

interface State {
  board: Board
  piece: Piece | null
  next: PieceData
  score: number
  lines: number
  level: number
  status: Status
}

type Action =
  | { type: 'START' }
  | { type: 'TICK' }
  | { type: 'SOFT_DROP' }
  | { type: 'MOVE'; dir: -1 | 1 }
  | { type: 'ROTATE' }
  | { type: 'HARD_DROP' }
  | { type: 'TOGGLE_PAUSE' }

// 七种方块定义（矩阵 + 颜色）
const TETROMINOES: Record<string, { color: string; matrix: number[][] }> = {
  I: { color: '#22d3ee', matrix: [[1, 1, 1, 1]] },
  O: { color: '#facc15', matrix: [[1, 1], [1, 1]] },
  T: { color: '#a78bfa', matrix: [[0, 1, 0], [1, 1, 1]] },
  S: { color: '#4ade80', matrix: [[0, 1, 1], [1, 1, 0]] },
  Z: { color: '#f87171', matrix: [[1, 1, 0], [0, 1, 1]] },
  J: { color: '#60a5fa', matrix: [[1, 0, 0], [1, 1, 1]] },
  L: { color: '#fb923c', matrix: [[0, 0, 1], [1, 1, 1]] },
}

// 消行得分（1/2/3/4 行）
const POINTS = [0, 100, 300, 500, 800]

const KEYS = Object.keys(TETROMINOES)

function randomPiece(): PieceData {
  const type = KEYS[Math.floor(Math.random() * KEYS.length)]
  const { color, matrix } = TETROMINOES[type]
  return { type, color, matrix }
}

function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null))
}

// 顺时针旋转矩阵
function rotateMatrix(matrix: number[][]): number[][] {
  return matrix[0].map((_, idx) => matrix.map((row) => row[idx]).reverse())
}

// 碰撞检测
function collide(board: Board, matrix: number[][], x: number, y: number): boolean {
  for (let dy = 0; dy < matrix.length; dy++) {
    for (let dx = 0; dx < matrix[dy].length; dx++) {
      if (!matrix[dy][dx]) continue
      const bx = x + dx
      const by = y + dy
      if (bx < 0 || bx >= COLS || by >= ROWS) return true
      if (by >= 0 && board[by][bx]) return true
    }
  }
  return false
}

// 将方块合并进棋盘
function merge(board: Board, piece: Piece): Board {
  const next = board.map((row) => [...row])
  piece.matrix.forEach((row, dy) =>
    row.forEach((v, dx) => {
      if (!v) return
      const by = piece.y + dy
      const bx = piece.x + dx
      if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) next[by][bx] = piece.color
    }),
  )
  return next
}

// 消除满行，返回新棋盘与消除行数
function clearLines(board: Board): { board: Board; cleared: number } {
  const kept = board.filter((row) => row.some((cell) => !cell))
  const cleared = ROWS - kept.length
  const empty = Array.from({ length: cleared }, () => Array<Cell>(COLS).fill(null))
  return { board: [...empty, ...kept], cleared }
}

function spawnPiece(next: PieceData): { piece: Piece; next: PieceData } {
  const piece: Piece = {
    ...next,
    x: Math.floor((COLS - next.matrix[0].length) / 2),
    y: 0,
  }
  return { piece, next: randomPiece() }
}

// 锁定当前方块，消行、计分、生成新方块
function lockPiece(state: State): State {
  const board = merge(state.board, state.piece!)
  const { board: clearedBoard, cleared } = clearLines(board)
  const score = state.score + POINTS[cleared] * state.level
  const lines = state.lines + cleared
  const level = Math.floor(lines / 10) + 1
  const { piece, next } = spawnPiece(state.next)

  if (collide(clearedBoard, piece.matrix, piece.x, piece.y)) {
    return { ...state, board: clearedBoard, piece, next, score, lines, level, status: 'over' }
  }
  return { ...state, board: clearedBoard, piece, next, score, lines, level }
}

function initialState(): State {
  return { board: createEmptyBoard(), piece: null, next: randomPiece(), score: 0, lines: 0, level: 1, status: 'ready' }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START': {
      const { piece, next } = spawnPiece(state.next)
      return { board: createEmptyBoard(), piece, next, score: 0, lines: 0, level: 1, status: 'playing' }
    }
    case 'TICK': {
      if (state.status !== 'playing' || !state.piece) return state
      if (!collide(state.board, state.piece.matrix, state.piece.x, state.piece.y + 1)) {
        return { ...state, piece: { ...state.piece, y: state.piece.y + 1 } }
      }
      return lockPiece(state)
    }
    case 'SOFT_DROP': {
      if (state.status !== 'playing' || !state.piece) return state
      if (!collide(state.board, state.piece.matrix, state.piece.x, state.piece.y + 1)) {
        return { ...state, piece: { ...state.piece, y: state.piece.y + 1 }, score: state.score + 1 }
      }
      return lockPiece(state)
    }
    case 'MOVE': {
      if (state.status !== 'playing' || !state.piece) return state
      const x = state.piece.x + action.dir
      if (collide(state.board, state.piece.matrix, x, state.piece.y)) return state
      return { ...state, piece: { ...state.piece, x } }
    }
    case 'ROTATE': {
      if (state.status !== 'playing' || !state.piece) return state
      const matrix = rotateMatrix(state.piece.matrix)
      // 简单的墙踢偏移
      for (const kick of [0, -1, 1, -2, 2]) {
        if (!collide(state.board, matrix, state.piece.x + kick, state.piece.y)) {
          return { ...state, piece: { ...state.piece, matrix, x: state.piece.x + kick } }
        }
      }
      return state
    }
    case 'HARD_DROP': {
      if (state.status !== 'playing' || !state.piece) return state
      let y = state.piece.y
      while (!collide(state.board, state.piece.matrix, state.piece.x, y + 1)) y++
      const piece = { ...state.piece, y }
      return lockPiece({ ...state, piece, score: state.score + (y - state.piece.y) * 2 })
    }
    case 'TOGGLE_PAUSE': {
      if (state.status === 'playing') return { ...state, status: 'paused' }
      if (state.status === 'paused') return { ...state, status: 'playing' }
      return state
    }
    default:
      return state
  }
}

// 渲染用：把当前方块叠加到棋盘上
function renderBoard(board: Board, piece: Piece | null): Board {
  const display = board.map((row) => [...row])
  if (!piece) return display
  piece.matrix.forEach((row, dy) =>
    row.forEach((v, dx) => {
      if (!v) return
      const by = piece.y + dy
      const bx = piece.x + dx
      if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) display[by][bx] = piece.color
    }),
  )
  return display
}

function CellView({ color }: { color: Cell }) {
  return (
    <div
      className="aspect-square rounded-[2px]"
      style={{
        backgroundColor: color ?? 'rgba(255,255,255,0.04)',
        boxShadow: color ? 'inset 0 0 0 1px rgba(0,0,0,0.2)' : undefined,
      }}
    />
  )
}

function NextPreview({ next }: { next: PieceData }) {
  const size = next.matrix[0].length
  return (
    <div
      className="grid gap-0.5 p-2 bg-black/30 rounded-lg"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, width: size * 22 }}
    >
      {next.matrix.flat().map((v, i) => (
        <div key={i} className="aspect-square rounded-[2px]" style={{ backgroundColor: v ? next.color : 'transparent' }} />
      ))}
    </div>
  )
}

function Tetris() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  const { board, piece, next, score, lines, level, status } = state

  // 重力下落
  useEffect(() => {
    if (status !== 'playing') return
    const speed = Math.max(100, 800 - (level - 1) * 70)
    const id = setInterval(() => dispatch({ type: 'TICK' }), speed)
    return () => clearInterval(id)
  }, [status, level])

  // 键盘控制
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          dispatch({ type: 'MOVE', dir: -1 })
          break
        case 'ArrowRight':
          e.preventDefault()
          dispatch({ type: 'MOVE', dir: 1 })
          break
        case 'ArrowDown':
          e.preventDefault()
          dispatch({ type: 'SOFT_DROP' })
          break
        case 'ArrowUp':
          e.preventDefault()
          dispatch({ type: 'ROTATE' })
          break
        case ' ':
          e.preventDefault()
          dispatch({ type: 'HARD_DROP' })
          break
        case 'p':
        case 'P':
          dispatch({ type: 'TOGGLE_PAUSE' })
          break
        case 'Enter':
          if (status !== 'playing') dispatch({ type: 'START' })
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [status])

  const display = renderBoard(board, piece)

  return (
    <div className="ts-wrap py-[var(--padt)] pb-[var(--padb)]">
      <div className="flex flex-col items-center space-y-10">
        {/* Page head */}
        <div className="text-center">
          <p className="text-[14px] text-muted mb-3 tracking-[0.01em]">· 游戏</p>
          <h1 className="text-[48px] md:text-[56px] leading-[1.04] tracking-[-0.03em] font-[500]"
              style={{ fontFamily: 'var(--font-display)' }}>
            俄罗斯方块
          </h1>
          <p className="text-muted text-[16px] mt-3">
            开始游戏，消除行数，刷新最高分
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Main board */}
          <div className="relative">
            <div
              className="grid gap-px bg-white/5 p-1 rounded-[var(--radius-md)] border border-white/5"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, width: COLS * 28 + 8 }}
            >
              {display.flat().map((cell, i) => (
                <CellView key={i} color={cell} />
              ))}
            </div>

            {/* Start / pause / game-over overlay */}
            {status !== 'playing' && (
              <div className="absolute inset-0 bg-bg/85 backdrop-blur-[2px] rounded-[var(--radius-md)] flex flex-col items-center justify-center space-y-5">
                <p className="text-[20px] text-muted tracking-[0.02em]">
                  {status === 'ready' ? '准备好了吗？' : status === 'paused' ? '已暂停' : '游戏结束'}
                </p>
                {status === 'over' && (
                  <p className="text-[40px] font-[500] text-accent tracking-[-0.03em]"
                     style={{ fontFamily: 'var(--font-display)' }}>
                    {score}
                  </p>
                )}
                <button
                  onClick={() => dispatch({ type: 'START' })}
                  className="ts-btn ts-btn-primary"
                >
                  {status === 'paused' ? '继续游戏' : '开始游戏'}
                </button>
                {status === 'paused' && (
                  <button
                    onClick={() => dispatch({ type: 'START' })}
                    className="ts-btn ts-btn-secondary"
                  >
                    重新开始
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — one system with deal tokens */}
          <div className="flex flex-col gap-4 w-full md:w-[220px]">
            {/* Score / lines / level */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
              <Stat label="得分" value={score} />
              <Stat label="行数" value={lines} />
              <Stat label="等级" value={level} />
            </div>

            {/* Next preview */}
            <div className="bg-surface border border-white/5 rounded-[var(--radius-sm)] p-4 flex flex-col items-center">
              <p className="text-[12px] text-muted mb-2 tracking-[0.01em]">下一个</p>
              <NextPreview next={next} />
            </div>

            {/* Touch controls */}
            <div className="grid grid-cols-3 gap-2">
              <TouchBtn label="旋转" onClick={() => dispatch({ type: 'ROTATE' })} />
              <TouchBtn label="◀" onClick={() => dispatch({ type: 'MOVE', dir: -1 })} />
              <TouchBtn label="▶" onClick={() => dispatch({ type: 'MOVE', dir: 1 })} />
              <TouchBtn label="▼" onClick={() => dispatch({ type: 'SOFT_DROP' })} />
              <TouchBtn label="坠落" onClick={() => dispatch({ type: 'HARD_DROP' })} />
              <TouchBtn
                label={status === 'paused' ? '继续' : '暂停'}
                onClick={() =>
                  status === 'playing' || status === 'paused'
                    ? dispatch({ type: 'TOGGLE_PAUSE' })
                    : null
                }
                variant="secondary"
              />
            </div>

            <p className="text-[12px] text-muted text-center leading-[1.6]">
              ← → 移动 · ↑ 旋转 · ↓ 加速 · 空格 直接下落 · P 暂停 · Enter 开始
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Small presentational helpers
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-surface border border-white/5 rounded-[var(--radius-sm)] p-4 text-center">
      <p className="text-[12px] text-muted tracking-[0.01em] mb-1">{label}</p>
      <p className="text-[24px] font-[500] text-ink leading-none"
         style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
    </div>
  )
}

function TouchBtn({
  label,
  onClick,
  variant = 'primary',
}: {
  label: string
  onClick: () => void | null
  variant?: 'primary' | 'secondary'
}) {
  return (
    <button
      onClick={onClick}
      className={`ts-btn !h-11 !px-2 !text-[14px] ${
        variant === 'primary' ? 'ts-btn-primary' : 'ts-btn-secondary'
      }`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {label}
    </button>
  )
}

export default Tetris
