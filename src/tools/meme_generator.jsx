import { useState, useRef, useCallback, useEffect } from 'react'
import ToolLayout from '../components/ToolLayout'

/* roundRect polyfill */
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    else r = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, r);
    this.moveTo(x + r.tl, y); this.lineTo(x + w - r.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr); this.lineTo(x + w, y + h - r.br);
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h); this.lineTo(x + r.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl); this.lineTo(x, y + r.tl);
    this.quadraticCurveTo(x, y, x + r.tl, y); this.closePath(); return this;
  };
}

/* Drawing helpers */
function drawStickPerson(c, x, y, sz, col, armDir) {
  c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 3;
  c.beginPath(); c.arc(x, y - sz * 0.6, sz * 0.25, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.moveTo(x, y - sz * 0.35); c.lineTo(x, y + sz * 0.2); c.stroke();
  if (armDir) {
    c.beginPath(); c.moveTo(x, y - sz * 0.2); c.lineTo(x - sz * 0.4, y - sz); c.stroke();
    c.beginPath(); c.moveTo(x, y - sz * 0.2); c.lineTo(x + sz * 0.3, y); c.stroke();
  } else {
    c.beginPath(); c.moveTo(x, y - sz * 0.2); c.lineTo(x - sz * 0.3, y); c.stroke();
    c.beginPath(); c.moveTo(x, y - sz * 0.2); c.lineTo(x + sz * 0.4, y + sz * 0.1); c.stroke();
  }
  c.beginPath(); c.moveTo(x, y + sz * 0.2); c.lineTo(x - sz * 0.25, y + sz * 0.6); c.stroke();
  c.beginPath(); c.moveTo(x, y + sz * 0.2); c.lineTo(x + sz * 0.25, y + sz * 0.6); c.stroke();
}
function drawRejectArrow(c, x, y, col) {
  c.strokeStyle = col; c.lineWidth = 4;
  c.beginPath(); c.moveTo(x - 30, y); c.lineTo(x + 30, y); c.stroke();
  c.beginPath(); c.moveTo(x - 20, y - 15); c.lineTo(x - 30, y); c.lineTo(x - 20, y + 15); c.stroke();
}
function drawApproveArrow(c, x, y, col) {
  c.strokeStyle = col; c.lineWidth = 4;
  c.beginPath(); c.moveTo(x - 30, y); c.lineTo(x + 30, y); c.stroke();
  c.beginPath(); c.moveTo(x + 20, y - 15); c.lineTo(x + 30, y); c.lineTo(x + 20, y + 15); c.stroke();
}
function drawGirlFigure(c, x, y, sz, col) {
  c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 2;
  c.beginPath(); c.arc(x, y - sz * 0.5, sz * 0.2, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.arc(x, y - sz * 0.55, sz * 0.22, 0, Math.PI); c.stroke();
  c.beginPath(); c.moveTo(x, y - sz * 0.3); c.lineTo(x - sz * 0.25, y + sz * 0.3); c.lineTo(x + sz * 0.25, y + sz * 0.3); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(x - sz * 0.1, y + sz * 0.3); c.lineTo(x - sz * 0.15, y + sz * 0.6); c.stroke();
  c.beginPath(); c.moveTo(x + sz * 0.1, y + sz * 0.3); c.lineTo(x + sz * 0.15, y + sz * 0.6); c.stroke();
}
function drawBoyFigure(c, x, y, sz, col, lookX) {
  c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 2;
  c.beginPath(); c.arc(x, y - sz * 0.5, sz * 0.2, 0, Math.PI * 2); c.fill();
  c.fillRect(x - sz * 0.15, y - sz * 0.3, sz * 0.3, sz * 0.5);
  c.beginPath(); c.moveTo(x - sz * 0.15, y - sz * 0.15); c.lineTo(x - sz * 0.4, y + sz * 0.1); c.stroke();
  c.beginPath(); c.moveTo(x + sz * 0.15, y - sz * 0.15); c.lineTo(x + sz * 0.4, y + sz * 0.1); c.stroke();
  c.fillStyle = '#fff';
  const eyeOff = (lookX > x) ? 2 : -2;
  c.fillRect(x - 6 + eyeOff, y - sz * 0.52, 4, 4);
  c.fillRect(x + 3 + eyeOff, y - sz * 0.52, 4, 4);
}
function drawSweatingPerson(c, x, y, sz, col) {
  c.fillStyle = col; c.strokeStyle = '#fff'; c.lineWidth = 2;
  c.beginPath(); c.arc(x, y + sz * 0.1, sz * 0.3, 0, Math.PI * 2); c.fill();
  c.fillRect(x - sz * 0.2, y + sz * 0.35, sz * 0.4, sz * 0.5);
  c.fillStyle = '#60a5fa';
  [[x + sz * 0.35, y], [x - sz * 0.35, y + sz * 0.1], [x + sz * 0.1, y - sz * 0.1]].forEach(([dx, dy]) => {
    c.beginPath(); c.ellipse(dx, dy, 3, 5, 0, 0, Math.PI * 2); c.fill();
  });
}
function drawButton(c, x, y, w, h, col, label) {
  c.fillStyle = col;
  c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 8); c.fill();
  c.strokeStyle = '#fff'; c.lineWidth = 2;
  c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, 8); c.stroke();
  c.fillStyle = '#fff'; c.font = 'bold 14px Impact,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(label, x, y);
}
function drawSittingPerson(c, x, y, sz, col) {
  c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 3;
  c.beginPath(); c.arc(x, y - sz * 0.7, sz * 0.22, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.moveTo(x, y - sz * 0.48); c.lineTo(x, y + sz * 0.1); c.stroke();
  c.beginPath(); c.moveTo(x, y - sz * 0.3); c.lineTo(x - sz * 0.5, y); c.stroke();
  c.beginPath(); c.moveTo(x, y - sz * 0.3); c.lineTo(x + sz * 0.5, y); c.stroke();
  c.beginPath(); c.moveTo(x, y + sz * 0.1); c.lineTo(x - sz * 0.3, y + sz * 0.5); c.stroke();
  c.beginPath(); c.moveTo(x, y + sz * 0.1); c.lineTo(x + sz * 0.3, y + sz * 0.5); c.stroke();
}
function drawBrainIcon(c, x, y, sz, col) {
  c.fillStyle = col; c.globalAlpha = 0.7;
  c.beginPath();
  c.moveTo(x, y + sz);
  c.bezierCurveTo(x - sz, y + sz * 0.5, x - sz, y - sz * 0.5, x, y - sz);
  c.bezierCurveTo(x + sz, y - sz * 0.5, x + sz, y + sz * 0.5, x, y + sz);
  c.fill();
  c.strokeStyle = col; c.lineWidth = 2;
  c.beginPath(); c.moveTo(x, y - sz); c.lineTo(x, y + sz); c.stroke();
  for (let i = -2; i <= 2; i++) {
    c.beginPath(); c.moveTo(x, y + i * sz * 0.3); c.bezierCurveTo(x + sz * 0.3, y + i * sz * 0.3 - 5, x + sz * 0.5, y + i * sz * 0.3 + 5, x + sz * 0.7, y + i * sz * 0.3); c.stroke();
  }
  c.globalAlpha = 1;
}
function drawFist(c, x, y, sz, col) {
  c.fillStyle = col; c.strokeStyle = '#78350f'; c.lineWidth = 3;
  c.beginPath(); c.roundRect(x - sz / 2, y - sz / 2, sz, sz, 12); c.fill(); c.stroke();
  for (let i = 0; i < 4; i++) {
    c.fillStyle = col;
    c.beginPath(); c.roundRect(x - sz / 2 + 5 + i * 13, y - sz / 2 - 12, 10, 15, 5); c.fill(); c.stroke();
  }
  c.beginPath(); c.roundRect(x + sz / 2 - 5, y - sz / 4, 12, 20, 5); c.fill(); c.stroke();
}
function drawThinkingHead(c, x, y, sz, col) {
  c.fillStyle = col; c.strokeStyle = '#fbbf24'; c.lineWidth = 3;
  c.beginPath(); c.arc(x, y, sz, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#fbbf24';
  c.beginPath(); c.moveTo(x + sz * 0.7, y - sz * 0.5); c.lineTo(x + sz * 1.2, y - sz * 0.9);
  c.lineTo(x + sz * 1.3, y - sz * 0.6); c.lineTo(x + sz * 0.8, y - sz * 0.3); c.closePath(); c.fill();
  c.strokeStyle = '#fff'; c.lineWidth = 2;
  c.beginPath(); c.arc(x, y + sz * 0.1, sz * 0.4, 0.1 * Math.PI, 0.9 * Math.PI); c.stroke();
  c.fillStyle = '#fff';
  c.beginPath(); c.arc(x - sz * 0.3, y - sz * 0.15, sz * 0.08, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.arc(x + sz * 0.3, y - sz * 0.15, sz * 0.08, 0, Math.PI * 2); c.fill();
}

const TEMPLATES = [
  { id: 'drake', name: 'Drake', w: 600, h: 600,
    draw(c, w, h) {
      const g = c.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#1a1a2e'); g.addColorStop(1, '#16213e');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.fillStyle = '#0f3460'; c.fillRect(20, 20, w - 40, h / 2 - 30);
      c.strokeStyle = '#e94560'; c.lineWidth = 2; c.strokeRect(20, 20, w - 40, h / 2 - 30);
      drawStickPerson(c, w * 0.3, h / 4, 25, '#e94560', true);
      drawRejectArrow(c, w * 0.7, h / 4, '#e94560');
      c.fillStyle = '#533483'; c.fillRect(20, h / 2 + 10, w - 40, h / 2 - 30);
      c.strokeStyle = '#e94560'; c.strokeRect(20, h / 2 + 10, w - 40, h / 2 - 30);
      drawStickPerson(c, w * 0.3, h * 3 / 4, 25, '#4ecca3', false);
      drawApproveArrow(c, w * 0.7, h * 3 / 4, '#4ecca3');
    }, defaultTop: 'Writing tests first', defaultBottom: 'Writing tests after'
  },
  { id: 'distracted', name: 'Distracted BF', w: 600, h: 400,
    draw(c, w, h) {
      c.fillStyle = '#1a1a2e'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#16213e'; c.fillRect(0, h * 0.6, w, h * 0.4);
      c.fillStyle = '#374151'; c.fillRect(0, h * 0.7, w, h * 0.08);
      for (let i = 0; i < w; i += 60) { c.fillStyle = '#fbbf24'; c.fillRect(i, h * 0.735, 30, 6); }
      drawGirlFigure(c, w * 0.2, h * 0.4, 40, '#ec4899');
      drawBoyFigure(c, w * 0.48, h * 0.38, 42, '#6366f1', w * 0.2);
      drawGirlFigure(c, w * 0.78, h * 0.38, 38, '#f59e0b');
    }, defaultTop: 'Me', defaultBottom: 'The bug I just fixed'
  },
  { id: 'twobuttons', name: 'Two Buttons', w: 600, h: 500,
    draw(c, w, h) {
      c.fillStyle = '#1a1a2e'; c.fillRect(0, 0, w, h);
      drawSweatingPerson(c, w / 2, h * 0.15, 50, '#6366f1');
      drawButton(c, w * 0.25, h * 0.65, 90, 40, '#ef4444', 'A');
      drawButton(c, w * 0.75, h * 0.65, 90, 40, '#3b82f6', 'B');
    }, defaultTop: 'Left button', defaultBottom: 'Right button'
  },
  { id: 'changemymind', name: 'Change My Mind', w: 600, h: 400,
    draw(c, w, h) {
      c.fillStyle = '#1a1a2e'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#92400e';
      c.fillRect(w * 0.15, h * 0.55, w * 0.7, 12);
      c.fillRect(w * 0.2, h * 0.56, 15, h * 0.35);
      c.fillRect(w * 0.78, h * 0.56, 15, h * 0.35);
      c.fillStyle = '#fef3c7'; c.fillRect(w * 0.3, h * 0.2, w * 0.4, h * 0.35);
      c.strokeStyle = '#92400e'; c.lineWidth = 3; c.strokeRect(w * 0.3, h * 0.2, w * 0.4, h * 0.35);
      drawSittingPerson(c, w * 0.5, h * 0.75, 35, '#6366f1');
    }, defaultTop: '', defaultBottom: 'Change my mind'
  },
  { id: 'expandingbrain', name: 'Expanding Brain', w: 600, h: 800,
    draw(c, w, h) {
      c.fillStyle = '#1a1a2e'; c.fillRect(0, 0, w, h);
      [{ y: 0, h: h / 4, col: '#374151', brain: '#6b7280' },
       { y: h / 4, h: h / 4, col: '#1e3a5f', brain: '#60a5fa' },
       { y: h / 2, h: h / 4, col: '#4c1d95', brain: '#a78bfa' },
       { y: 3 * h / 4, h: h / 4, col: '#7c2d12', brain: '#fbbf24' }
      ].forEach((p, i) => {
        c.fillStyle = p.col; c.fillRect(0, p.y, w, p.h);
        c.strokeStyle = '#fff3'; c.lineWidth = 1; c.strokeRect(0, p.y, w, p.h);
        const sz = 12 + i * 10;
        drawBrainIcon(c, w / 2 - 40, p.y + p.h / 2, sz, p.brain);
      });
    }, defaultTop: 'Normal', defaultBottom: 'Galaxy brain'
  },
  { id: 'isThis', name: 'Is This', w: 600, h: 400,
    draw(c, w, h) {
      c.fillStyle = '#1a1a2e'; c.fillRect(0, 0, w, h);
      drawSittingPerson(c, w * 0.5, h * 0.6, 45, '#6366f1');
      c.fillStyle = '#fef3c7'; c.fillRect(w * 0.25, h * 0.1, w * 0.5, h * 0.35);
      c.strokeStyle = '#92400e'; c.lineWidth = 3; c.strokeRect(w * 0.25, h * 0.1, w * 0.5, h * 0.35);
      c.fillStyle = '#1e293b'; c.font = 'bold 20px Impact,sans-serif'; c.textAlign = 'center';
      c.fillText('Is this', w * 0.5, h * 0.28);
    }, defaultTop: 'Is this', defaultBottom: 'A meme?'
  },
  { id: 'boyfriendig', name: 'BF Ignores', w: 600, h: 400,
    draw(c, w, h) {
      c.fillStyle = '#1a1a2e'; c.fillRect(0, 0, w, h);
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#1e3a5f'); g.addColorStop(1, '#0f172a');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      drawGirlFigure(c, w * 0.15, h * 0.5, 50, '#ec4899');
      drawBoyFigure(c, w * 0.5, h * 0.5, 55, '#6366f1', w * 0.85);
    }, defaultTop: 'Girlfriend: Can you talk?', defaultBottom: 'Boyfriend: *looks at phone*'
  },
  { id: 'success', name: 'Success Kid', w: 600, h: 400,
    draw(c, w, h) {
      c.fillStyle = '#1a1a2e'; c.fillRect(0, 0, w, h);
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#0ea5e9'); g.addColorStop(0.5, '#38bdf8');
      g.addColorStop(0.6, '#fbbf24'); g.addColorStop(1, '#92400e');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      drawFist(c, w / 2, h / 2, 60, '#fbbf24');
      c.fillStyle = '#78350f';
      for (let i = 0; i < 30; i++) {
        c.beginPath(); c.arc(w * 0.3 + Math.random() * w * 0.4, h * 0.7 + Math.random() * 30, 2 + Math.random() * 3, 0, Math.PI * 2); c.fill();
      }
    }, defaultTop: 'When your code compiles', defaultBottom: 'On the first try'
  },
  { id: 'afraid', name: 'Afraid to Ask', w: 600, h: 400,
    draw(c, w, h) {
      c.fillStyle = '#1a1a2e'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#1e293b'; c.fillRect(0, h * 0.4, w, h * 0.6);
      c.fillStyle = '#0f172a'; c.fillRect(0, h * 0.4, w, 4);
      c.fillStyle = '#92400e'; c.fillRect(w * 0.2, h * 0.65, w * 0.6, 10);
      drawSittingPerson(c, w * 0.5, h * 0.55, 40, '#6366f1');
    }, defaultTop: 'Afraid to ask', defaultBottom: 'But what does this do?'
  },
  { id: 'rollsafe', name: 'Roll Safe', w: 600, h: 400,
    draw(c, w, h) {
      c.fillStyle = '#1a1a2e'; c.fillRect(0, 0, w, h);
      const g = c.createRadialGradient(w * 0.4, h * 0.4, 50, w * 0.5, h * 0.5, w * 0.6);
      g.addColorStop(0, '#1e3a5f'); g.addColorStop(1, '#0f172a');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      drawThinkingHead(c, w * 0.45, h * 0.4, 70, '#6366f1');
    }, defaultTop: "Can't have bugs", defaultBottom: "If you don't write code"
  }
];

const COLOR_PRESETS = ['#ffffff', '#000000', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

const PHRASES = [
  ["When the tests pass", "But you didn't write any"],
  ["Nobody:", "Absolutely nobody:", "Me: *writes code*"],
  ["That feeling when", "Your PR gets approved"],
  ["It's not a bug", "It's a feature"],
  ["One does not simply", "Write bug-free code"],
  ["This is fine", "*code is on fire*"],
  ["I don't always test", "But when I do, I do it in production"],
  ["Stonks", "When your code actually works"],
  ["Modern problems", "Require modern solutions"],
  ["They're the same picture", "Bugs and features"],
  ["Wait, that's illegal", "console.log everywhere"],
  ["Ain't nobody got time for that", "Reading documentation"],
  ["First world problems", "When WiFi is slow"],
  ["Why are you booing me?", "I'm right!"],
  ["Not sure if", "Genius or just lucky"],
];

function drawMemeText(c, text, x, y, size, fill, stroke, strokeW, canvasW) {
  if (!text) return;
  c.save();
  c.font = `bold ${size}px Impact, "Arial Black", sans-serif`;
  c.textAlign = 'center'; c.textBaseline = 'top';
  const maxW = canvasW * 0.9;
  const words = text.split(' ');
  const lines = []; let line = '';
  words.forEach(w => {
    const test = line ? line + ' ' + w : w;
    if (c.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  });
  if (line) lines.push(line);
  lines.forEach((l, i) => {
    const ly = y + i * (size * 1.15);
    if (strokeW > 0) {
      c.strokeStyle = stroke; c.lineWidth = strokeW; c.lineJoin = 'round'; c.miterLimit = 2;
      c.strokeText(l, x, ly);
    }
    c.fillStyle = fill; c.fillText(l, x, ly);
  });
  c.restore();
}

export default function meme_generator() {
  const canvasRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [topText, setTopText] = useState(TEMPLATES[0].defaultTop);
  const [bottomText, setBottomText] = useState(TEMPLATES[0].defaultBottom);
  const [topSize, setTopSize] = useState(32);
  const [bottomSize, setBottomSize] = useState(32);
  const [topFill, setTopFill] = useState('#ffffff');
  const [bottomFill, setBottomFill] = useState('#ffffff');
  const [topStroke, setTopStroke] = useState('#000000');
  const [bottomStroke, setBottomStroke] = useState('#000000');
  const [topStrokeW, setTopStrokeW] = useState(3);
  const [bottomStrokeW, setBottomStrokeW] = useState(3);
  const [activeText, setActiveText] = useState('top');
  const [hintText, setHintText] = useState('💡 Click on the canvas to reposition text.');
  const textPosRef = useRef({ top: { x: null, y: null }, bottom: { x: null, y: null } });

  const renderMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const t = TEMPLATES[selectedTemplate];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t.draw(ctx, canvas.width, canvas.height);
    const tp = textPosRef.current;
    if (topText) {
      const tx = tp.top.x ?? canvas.width / 2;
      const ty = tp.top.y ?? Math.max(topSize + 10, canvas.height * 0.1);
      drawMemeText(ctx, topText, tx, ty, topSize, topFill, topStroke, topStrokeW, canvas.width);
    }
    if (bottomText) {
      const bx = tp.bottom.x ?? canvas.width / 2;
      const by = tp.bottom.y ?? canvas.height - Math.max(bottomSize + 10, canvas.height * 0.08);
      drawMemeText(ctx, bottomText, bx, by, bottomSize, bottomFill, bottomStroke, bottomStrokeW, canvas.width);
    }
  }, [selectedTemplate, topText, bottomText, topSize, bottomSize, topFill, bottomFill, topStroke, bottomStroke, topStrokeW, bottomStrokeW]);

  useEffect(() => {
    const t = TEMPLATES[selectedTemplate];
    const canvas = canvasRef.current;
    if (canvas && t) {
      canvas.width = t.w; canvas.height = t.h;
      renderMeme();
    }
  }, [selectedTemplate, renderMeme]);

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;
    const tp = textPosRef.current;
    if (activeText === 'top') {
      tp.top.x = cx; tp.top.y = cy;
      setActiveText('bottom');
      setHintText('📝 Now click to position BOTTOM text...');
    } else {
      tp.bottom.x = cx; tp.bottom.y = cy;
      setActiveText('top');
      setHintText('📝 Now click to position TOP text...');
    }
    renderMeme();
  }, [activeText, renderMeme]);

  const selectTemplate = useCallback((i) => {
    const t = TEMPLATES[i];
    setSelectedTemplate(i);
    setTopText(t.defaultTop);
    setBottomText(t.defaultBottom);
    textPosRef.current = { top: { x: null, y: null }, bottom: { x: null, y: null } };
    setActiveText('top');
    setHintText('💡 Click on the canvas to reposition text.');
  }, []);

  const randomize = useCallback(() => {
    const p = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    setTopText(p[0] || '');
    setBottomText(p[1] || '');
    textPosRef.current = { top: { x: null, y: null }, bottom: { x: null, y: null } };
  }, []);

  const downloadMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'meme-' + Date.now() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const resetTextPos = useCallback((which) => {
    textPosRef.current[which] = { x: null, y: null };
    setActiveText(which);
    renderMeme();
  }, [renderMeme]);

  const t = TEMPLATES[selectedTemplate];

  return (
    <ToolLayout
      title="Meme Generator"
      desc="Choose a classic meme template, add your text, and download. 100% client-side."
      icon="😂" iconBg="rgba(99,102,241,0.08)"
      category="fun" slug="meme-generator"
    >
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-300 mb-3">Pick a Template</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {TEMPLATES.map((tmpl, i) => (
              <button key={tmpl.id} onClick={() => selectTemplate(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative flex items-center justify-center bg-[#111827] hover:scale-105 ${i === selectedTemplate ? 'border-purple-500 shadow-lg shadow-purple-500/30' : 'border-transparent hover:border-indigo-500/50'}`}>
                <TemplateThumb template={tmpl} />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] text-center py-0.5 text-slate-300 rounded-b-xl">{tmpl.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-300 mb-3">Preview</h2>
          <div className="flex justify-center bg-black rounded-xl overflow-hidden">
            <canvas ref={canvasRef} onClick={handleCanvasClick} className="max-w-full h-auto cursor-crosshair rounded-xl" />
          </div>
          <p className="text-center text-xs text-slate-400 mt-2 py-2 bg-white/[0.04] rounded-lg">{hintText}</p>
        </div>

        <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/[0.04] rounded-xl p-3.5 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-300 mb-2.5">⬆️ Top Text</h3>
              <input className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                value={topText} onChange={e => setTopText(e.target.value)} placeholder="Top text..." />
              <div className="flex items-center gap-2 mt-2">
                <label className="text-[11px] text-slate-400 shrink-0">Size</label>
                <input type="range" min="12" max="72" value={topSize} onChange={e => setTopSize(+e.target.value)} className="flex-1 accent-purple-500" />
                <span className="text-[11px] text-slate-400 w-6 text-center">{topSize}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <label className="text-[11px] text-slate-400 shrink-0">Fill</label>
                <input type="color" value={topFill} onChange={e => setTopFill(e.target.value)} className="w-7 h-6 rounded border border-white/10 cursor-pointer bg-transparent" />
                <div className="flex gap-1">
                  {COLOR_PRESETS.map(col => (
                    <button key={col} onClick={() => setTopFill(col)} className="w-5 h-5 rounded-full border-2 transition-all hover:scale-110"
                      style={{ background: col, borderColor: col === topFill ? '#fff' : '#1e293b' }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <label className="text-[11px] text-slate-400 shrink-0">Stroke</label>
                <input type="color" value={topStroke} onChange={e => setTopStroke(e.target.value)} className="w-7 h-6 rounded border border-white/10 cursor-pointer bg-transparent" />
                <label className="text-[11px] text-slate-400">Width</label>
                <input type="range" min="0" max="8" step="0.5" value={topStrokeW} onChange={e => setTopStrokeW(+e.target.value)} className="flex-1 accent-purple-500" />
                <span className="text-[11px] text-slate-400 w-5 text-center">{topStrokeW}</span>
              </div>
              <button onClick={() => resetTextPos('top')} className="mt-2 bg-white/[0.06] border border-white/[0.08] text-[11px] px-3 py-1 rounded-lg text-slate-400 hover:text-white transition-all">Reset Position</button>
            </div>
            <div className="bg-white/[0.04] rounded-xl p-3.5 border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-indigo-300 mb-2.5">⬇️ Bottom Text</h3>
              <input className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="Bottom text..." />
              <div className="flex items-center gap-2 mt-2">
                <label className="text-[11px] text-slate-400 shrink-0">Size</label>
                <input type="range" min="12" max="72" value={bottomSize} onChange={e => setBottomSize(+e.target.value)} className="flex-1 accent-purple-500" />
                <span className="text-[11px] text-slate-400 w-6 text-center">{bottomSize}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <label className="text-[11px] text-slate-400 shrink-0">Fill</label>
                <input type="color" value={bottomFill} onChange={e => setBottomFill(e.target.value)} className="w-7 h-6 rounded border border-white/10 cursor-pointer bg-transparent" />
                <div className="flex gap-1">
                  {COLOR_PRESETS.map(col => (
                    <button key={col} onClick={() => setBottomFill(col)} className="w-5 h-5 rounded-full border-2 transition-all hover:scale-110"
                      style={{ background: col, borderColor: col === bottomFill ? '#fff' : '#1e293b' }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <label className="text-[11px] text-slate-400 shrink-0">Stroke</label>
                <input type="color" value={bottomStroke} onChange={e => setBottomStroke(e.target.value)} className="w-7 h-6 rounded border border-white/10 cursor-pointer bg-transparent" />
                <label className="text-[11px] text-slate-400">Width</label>
                <input type="range" min="0" max="8" step="0.5" value={bottomStrokeW} onChange={e => setBottomStrokeW(+e.target.value)} className="flex-1 accent-purple-500" />
                <span className="text-[11px] text-slate-400 w-5 text-center">{bottomStrokeW}</span>
              </div>
              <button onClick={() => resetTextPos('bottom')} className="mt-2 bg-white/[0.06] border border-white/[0.08] text-[11px] px-3 py-1 rounded-lg text-slate-400 hover:text-white transition-all">Reset Position</button>
            </div>
          </div>
          <div className="flex gap-3 justify-center mt-4">
            <button onClick={downloadMeme} className="glow-btn text-xs px-5 py-2 rounded-xl">⬇️ Download PNG</button>
            <button onClick={randomize} className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs px-5 py-2 rounded-xl text-slate-300 transition-all">🎲 Random Text</button>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}

function TemplateThumb({ template: t }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 120; canvas.height = 120;
    const ctx = canvas.getContext('2d');
    ctx.save();
    const scale = Math.min(120 / t.w, 120 / t.h);
    ctx.translate((120 - t.w * scale) / 2, (120 - t.h * scale) / 2);
    ctx.scale(scale, scale);
    t.draw(ctx, t.w, t.h);
    ctx.restore();
  }, [t]);
  return <canvas ref={canvasRef} className="w-full h-full rounded-lg" />;
}
