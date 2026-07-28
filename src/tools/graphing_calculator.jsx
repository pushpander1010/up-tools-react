import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

const COLORS = ['#6366f1', '#22c55e', '#f97316'];
const BG = '#0c0c14';

function compileExpr(expr) {
  if (!expr.trim()) return null;
  let safe = expr.replace(/\s+/g, '')
    .replace(/\^/g, '**')
    .replace(/\b(pi)\b/gi, 'Math.PI')
    .replace(/\be\b/g, 'Math.E')
    .replace(/\bsin\(/gi, 'Math.sin(')
    .replace(/\bcos\(/gi, 'Math.cos(')
    .replace(/\btan\(/gi, 'Math.tan(')
    .replace(/\basin\(/gi, 'Math.asin(')
    .replace(/\bacos\(/gi, 'Math.acos(')
    .replace(/\batan\(/gi, 'Math.atan(')
    .replace(/\blog\(/gi, 'Math.log10(')
    .replace(/\bln\(/gi, 'Math.log(')
    .replace(/\bsqrt\(/gi, 'Math.sqrt(')
    .replace(/\babs\(/gi, 'Math.abs(')
    .replace(/\bexp\(/gi, 'Math.exp(');
  try {
    const fn = new Function('x', 'return ' + safe + ';');
    fn(0); fn(1);
    return fn;
  } catch (e) { return null; }
}

function niceStep(range) {
  const rough = range / 8;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  let step;
  if (norm < 1.5) step = 1;
  else if (norm < 3.5) step = 2;
  else if (norm < 7.5) step = 5;
  else step = 10;
  return step * mag;
}

export default function graphing_calculator() {
  const canvasWrapRef = useRef(null);
  const canvasRef = useRef(null);
  const coordsRef = useRef(null);
  const stateRef = useRef({
    W: 0, H: 0, cx: 0, cy: 0, scale: 40,
    dragging: false, lastMX: 0, lastMY: 0,
    mouseX: null, mouseY: null,
    funcs: [
      { expr: 'sin(x)', compiled: compileExpr('sin(x)') },
      { expr: 'x^2/10', compiled: compileExpr('x^2/10') },
    ],
    animFrame: null,
  });
  const [, forceUpdate] = useState(0);

  const worldToScreen = useCallback((wx, wy) => {
    const s = stateRef.current;
    return [s.W / 2 + (wx - s.cx) * s.scale, s.H / 2 - (wy - s.cy) * s.scale];
  }, []);

  const screenToWorld = useCallback((sx, sy) => {
    const s = stateRef.current;
    return [(sx - s.W / 2) / s.scale + s.cx, -(sy - s.H / 2) / s.scale + s.cy];
  }, []);

  const draw = useCallback(() => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { W, H, cx, cy, scale } = s;
    if (!W || !H) return;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    const [xMin] = screenToWorld(0, 0);
    const [xMax] = screenToWorld(W, 0);
    const [, yMax] = screenToWorld(0, 0);
    const [, yMin] = screenToWorld(0, H);

    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const xStep = niceStep(xRange);
    const yStep = niceStep(yRange);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    let start;
    start = Math.floor(xMin / xStep) * xStep;
    for (let x = start; x <= xMax; x += xStep) {
      const [sx] = worldToScreen(x, 0);
      ctx.moveTo(sx, 0); ctx.lineTo(sx, H);
    }
    start = Math.floor(yMin / yStep) * yStep;
    for (let y = start; y <= yMax; y += yStep) {
      const [, sy] = worldToScreen(0, y);
      ctx.moveTo(0, sy); ctx.lineTo(W, sy);
    }
    ctx.stroke();

    // Axes
    const [ax0] = worldToScreen(0, 0);
    const [, ay0] = worldToScreen(0, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ax0, 0); ctx.lineTo(ax0, H);
    ctx.moveTo(0, ay0); ctx.lineTo(W, ay0);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '11px -apple-system,BlinkMacSystemFont,Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    start = Math.floor(xMin / xStep) * xStep;
    for (let x = start; x <= xMax; x += xStep) {
      if (Math.abs(x) < xStep * 0.01) continue;
      const [sx] = worldToScreen(x, 0);
      const label = Math.abs(x) < 0.001 ? x.toExponential(1) : parseFloat(x.toPrecision(10)).toString();
      ctx.fillText(label, sx, Math.min(ay0 + 4, H - 14));
    }
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    start = Math.floor(yMin / yStep) * yStep;
    for (let y = start; y <= yMax; y += yStep) {
      if (Math.abs(y) < yStep * 0.01) continue;
      const [, sy] = worldToScreen(0, y);
      const label = Math.abs(y) < 0.001 ? y.toExponential(1) : parseFloat(y.toPrecision(10)).toString();
      ctx.fillText(label, Math.max(ax0 + 4, 4), sy);
    }

    // Plot functions
    s.funcs.forEach((f, i) => {
      if (!f.compiled) return;
      ctx.strokeStyle = COLORS[i % COLORS.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      const step = Math.max((xMax - xMin) / W * 0.5, 1e-9);
      for (let x = xMin; x <= xMax; x += step) {
        let y;
        try { y = f.compiled(x); } catch (e) { started = false; continue; }
        if (!isFinite(y) || isNaN(y)) { started = false; continue; }
        const [sx, sy] = worldToScreen(x, y);
        if (sy < -5000 || sy > H + 5000) { started = false; continue; }
        if (!started) { ctx.moveTo(sx, sy); started = true; }
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    });

    // Crosshair + hover dot
    if (s.mouseX !== null) {
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(s.mouseX, 0); ctx.lineTo(s.mouseX, H);
      ctx.moveTo(0, s.mouseY); ctx.lineTo(W, s.mouseY);
      ctx.stroke();
      ctx.setLineDash([]);
      s.funcs.forEach((f, i) => {
        if (!f.compiled) return;
        const [wx] = screenToWorld(s.mouseX, s.mouseY);
        try {
          const wy = f.compiled(wx);
          if (!isFinite(wy) || isNaN(wy)) return;
          const [sx, sy] = worldToScreen(wx, wy);
          if (sy < -100 || sy > H + 100) return;
          ctx.fillStyle = COLORS[i % COLORS.length];
          ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2); ctx.fill();
        } catch (e) {}
      });
    }
  }, [worldToScreen, screenToWorld]);

  useEffect(() => {
    const wrap = canvasWrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    function resize() {
      const s = stateRef.current;
      const r = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      s.W = r.width; s.H = r.height;
      canvas.width = s.W * dpr; canvas.height = s.H * dpr;
      canvas.style.width = s.W + 'px'; canvas.style.height = s.H + 'px';
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function onMouseDown(e) {
      const s = stateRef.current;
      s.dragging = true; s.lastMX = e.clientX; s.lastMY = e.clientY;
      canvas.style.cursor = 'grabbing';
    }
    function onMouseUp() {
      const s = stateRef.current;
      s.dragging = false; canvas.style.cursor = 'crosshair';
    }
    function onMouseMove(e) {
      const s = stateRef.current;
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - r.left; const my = e.clientY - r.top;
      if (mx < 0 || mx > s.W || my < 0 || my > s.H) {
        s.mouseX = null; s.mouseY = null;
        if (coordsRef.current) coordsRef.current.textContent = '';
        draw(); return;
      }
      s.mouseX = mx; s.mouseY = my;
      if (s.dragging) {
        const dx = e.clientX - s.lastMX; const dy = e.clientY - s.lastMY;
        s.cx -= dx / s.scale; s.cy += dy / s.scale;
        s.lastMX = e.clientX; s.lastMY = e.clientY;
      }
      const [wx, wy] = screenToWorld(mx, my);
      if (coordsRef.current) coordsRef.current.textContent = 'x: ' + wx.toFixed(4) + ', y: ' + wy.toFixed(4);
      draw();
    }
    function onMouseLeave() {
      const s = stateRef.current;
      s.mouseX = null; s.mouseY = null; draw();
      if (coordsRef.current) coordsRef.current.textContent = '';
    }
    function onWheel(e) {
      e.preventDefault();
      const s = stateRef.current;
      const r = wrap.getBoundingClientRect();
      const mx = e.clientX - r.left; const my = e.clientY - r.top;
      const [wx, wy] = screenToWorld(mx, my);
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      s.scale *= factor;
      s.cx = wx - (mx - s.W / 2) / s.scale;
      s.cy = wy + (my - s.H / 2) / s.scale;
      draw();
    }

    // Touch support
    let lastTouchDist = 0;
    function onTouchStart(e) {
      const s = stateRef.current;
      if (e.touches.length === 1) {
        s.dragging = true; s.lastMX = e.touches[0].clientX; s.lastMY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        s.dragging = false;
        lastTouchDist = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY);
      }
    }
    function onTouchMove(e) {
      e.preventDefault();
      const s = stateRef.current;
      if (e.touches.length === 1 && s.dragging) {
        const dx = e.touches[0].clientX - s.lastMX; const dy = e.touches[0].clientY - s.lastMY;
        s.cx -= dx / s.scale; s.cy += dy / s.scale;
        s.lastMX = e.touches[0].clientX; s.lastMY = e.touches[0].clientY;
        const r = wrap.getBoundingClientRect();
        const mx = e.touches[0].clientX - r.left; const my = e.touches[0].clientY - r.top;
        const [wx, wy] = screenToWorld(mx, my);
        s.mouseX = mx; s.mouseY = my;
        if (coordsRef.current) coordsRef.current.textContent = 'x: ' + wx.toFixed(4) + ', y: ' + wy.toFixed(4);
        draw();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(e.touches[1].clientX - e.touches[0].clientX, e.touches[1].clientY - e.touches[0].clientY);
        const r = wrap.getBoundingClientRect();
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top;
        const [wx, wy] = screenToWorld(mx, my);
        s.scale *= dist / lastTouchDist;
        s.cx = wx - (mx - s.W / 2) / s.scale;
        s.cy = wy + (my - s.H / 2) / s.scale;
        lastTouchDist = dist; draw();
      }
    }
    function onTouchEnd() {
      const s = stateRef.current;
      s.dragging = false; s.mouseX = null; s.mouseY = null; draw();
    }

    resize();
    window.addEventListener('resize', resize);
    wrap.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    wrap.addEventListener('mouseleave', onMouseLeave);
    wrap.addEventListener('wheel', onWheel, { passive: false });
    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchmove', onTouchMove, { passive: false });
    wrap.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('resize', resize);
      wrap.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      wrap.removeEventListener('mouseleave', onMouseLeave);
      wrap.removeEventListener('wheel', onWheel);
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchmove', onTouchMove);
      wrap.removeEventListener('touchend', onTouchEnd);
    };
  }, [draw, screenToWorld]);

  const updateFunc = useCallback((i, value) => {
    const s = stateRef.current;
    s.funcs[i].expr = value;
    s.funcs[i].compiled = compileExpr(value);
    draw();
    forceUpdate(n => n + 1);
  }, [draw]);

  const addFunc = useCallback(() => {
    const s = stateRef.current;
    if (s.funcs.length >= 3) return;
    s.funcs.push({ expr: '', compiled: null });
    draw();
    forceUpdate(n => n + 1);
  }, [draw]);

  const removeFunc = useCallback((i) => {
    const s = stateRef.current;
    s.funcs.splice(i, 1);
    draw();
    forceUpdate(n => n + 1);
  }, [draw]);

  const resetView = useCallback(() => {
    stateRef.current.cx = 0; stateRef.current.cy = 0; stateRef.current.scale = 40; draw();
  }, [draw]);

  const zoomIn = useCallback(() => { stateRef.current.scale *= 1.4; draw(); }, [draw]);
  const zoomOut = useCallback(() => { stateRef.current.scale /= 1.4; draw(); }, [draw]);

  return (
    <ToolLayout
      title="Graphing Calculator"
      desc="Plot up to 3 functions. Supports sin, cos, tan, log, sqrt, abs, pi, e, +, -, *, /, ^. Pan and zoom with mouse."
      icon="📐" iconBg="rgba(99,102,241,0.08)"
      category="math" slug="graphing-calculator"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="space-y-2">
            {stateRef.current.funcs.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <input className="flex-1 min-w-0 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500/50"
                  value={f.expr} onChange={e => updateFunc(i, e.target.value)}
                  placeholder="e.g. sin(x)" />
                <button onClick={() => removeFunc(i)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-sm transition-all">×</button>
              </div>
            ))}
          </div>
          {stateRef.current.funcs.length < 3 && (
            <button onClick={addFunc} className="glow-btn text-xs px-3 py-1.5 rounded-xl mt-2">+ Add Function</button>
          )}

          <div ref={canvasWrapRef} className="relative w-full rounded-xl overflow-hidden border border-white/[0.08] bg-[#0c0c14] mt-3" style={{ aspectRatio: '4/3', cursor: 'crosshair' }}>
            <canvas ref={canvasRef} className="block w-full h-full" />
            <div ref={coordsRef} className="absolute top-2 right-2 bg-black/80 border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-slate-400 pointer-events-none font-mono backdrop-blur-sm" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">Mouse: drag to pan · scroll to zoom · hover for coordinates</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            <button onClick={resetView} className="bg-white/[0.04] border border-white/[0.08] text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:border-indigo-500/50 transition-all">Reset View</button>
            <button onClick={zoomIn} className="bg-white/[0.04] border border-white/[0.08] text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:border-indigo-500/50 transition-all">Zoom In</button>
            <button onClick={zoomOut} className="bg-white/[0.04] border border-white/[0.08] text-xs px-3 py-1.5 rounded-lg text-slate-300 hover:border-indigo-500/50 transition-all">Zoom Out</button>
          </div>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-300 mb-2">How to Use</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Type any mathematical expression in the input fields above. The graph updates live as you type.<br />
            <b className="text-slate-300">Supported:</b> sin, cos, tan, asin, acos, atan, log (base 10), ln (natural log), sqrt, abs, exp, pi, e, ^ (power), +, -, *, /<br />
            <b className="text-slate-300">Examples:</b> sin(x), x^2, log(x), sqrt(abs(x)), cos(x)*x, 1/x
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
