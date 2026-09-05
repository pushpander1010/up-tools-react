"""Convert one standard game file to the shared <GameShell> wrapper.

Usage: python3 scripts/convert-game-shell.py <file> --name NAME --start EXPR --label LABEL [--extra IMPORTCODE]

What it does (mechanical only — game logic untouched):
1. Replaces the 5 shell imports (ToolLayout, useJumpToResult, useFullscreen,
   GameAdSlot, InterstitialAd) with GameShell (+ keeps useState/useCallback/
   useEffect/useRef line as-is).
2. Deletes the useJumpToResult hook line, the useFullscreen+showAd+pendingAction+
   triggerAd+onAdDismiss block, and the fullscreenchange sync effect.
3. Replaces `<ToolLayout`(+hideHeader) with `<GameShell name=... startAction=
   startLabel= extraButtons=>`, keeping all other props (title/desc/icon/...).
4. Removes <InterstitialAd.../> line, left rail div, right rail div, bottom
   banner div, lone toggleFs button rows, and `ref={resultRef}` attrs.
5. Replaces triggerAd(X) call sites per --triggermap (default: bare X -> X).
6. Replaces </ToolLayout> with </GameShell>.

Anything it can't handle prints a WARN and leaves a marker for manual fix.
Idempotent-ish: refuses to run twice (checks for GameShell import).
"""
import re, sys, argparse

SHELL_IMPORTS = [
    "import ToolLayout from '../components/ToolLayout'",
    "import useJumpToResult from '../hooks/useJumpToResult'",
    "import useFullscreen from '../hooks/useFullscreen'",
    "import GameAdSlot from '../components/GameAdSlot'",
    "import InterstitialAd from '../components/InterstitialAd'",
]

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('file')
    ap.add_argument('--name', required=True)
    ap.add_argument('--start', required=True, help='JS expr for startAction, e.g. startGame or () => startGame(difficulty)')
    ap.add_argument('--label', required=True)
    ap.add_argument('--extra', default='', help='JSX for extraButtons prop (raw)')
    ap.add_argument('--tmap', action='append', default=[], help='triggerAd rewrite OLD >>> NEW (repeatable)')
    ap.add_argument('--check', action='store_true', help='dry run: only report what would change')
    a = ap.parse_args()

    src = open(a.file).read()
    if 'GameShell' in src:
        print('SKIP: already converted'); return
    orig = src
    warns = []

    # 1. imports
    for imp in SHELL_IMPORTS:
        if imp in src:
            src = src.replace(imp + '\n', '')
        else:
            warns.append(f'import not found: {imp}')
    src = src.replace(
        "import { useState, useCallback, useEffect, useRef } from 'react'",
        "import { useState, useCallback, useEffect, useRef } from 'react'\nimport GameShell from '../components/GameShell'",
        1)

    # 2a. jumpToResult hook line (2 common shapes)
    src, n = re.subn(r"\s*const \{ ref: resultRef, jumpTo \} = useJumpToResult\(\)\n", "\n", src)
    if not n: warns.append('jumpToResult hook line not found')
    # 2b. fullscreen+ad wiring block (several shapes)
    block_pat = re.compile(
        r"\s*const \{ isFs, toggle: toggleFs, onChange: onFsChange \} = useFullscreen\(\)\n"
        r"(?:\s*const \[showAd, setShowAd\] = useState\(false\)\n)?"
        r"(?:\s*const pendingAction = useRef\(null\)\n)?"
        r"(?:\s*const triggerAd = useCallback\(\(action\) => \{[^\n]*\n(?:.*\n)??.*?pendingAction\.current = action.*?\n.*?\n)?"
        , re.S)
    # simpler: line-based removal
    lines = src.split('\n')
    out, skip_next = [], 0
    removed = {'fs': 0, 'ad': 0}
    for i, l in enumerate(lines):
        s = l.strip()
        if 'useFullscreen()' in s and 'toggle' in s:
            removed['fs'] += 1; continue
        if s.startswith('const [showAd, setShowAd]'):
            removed['ad'] += 1; continue
        if s.startswith('const pendingAction'):
            removed['ad'] += 1; continue
        if s.startswith('const triggerAd'):
            # may span multiple lines: skip until balanced parens
            removed['ad'] += 1
            depth = s.count('(') - s.count(')')
            j = i
            while depth > 0 and j + 1 < len(lines):
                j += 1
                depth += lines[j].count('(') - lines[j].count(')')
            # drop lines i..j
            for k in range(i + 1, j + 1):
                lines[k] = ''
            continue
        if s.startswith('const onAdDismiss'):
            removed['ad'] += 1
            depth = s.count('(') - s.count(')')
            j = i
            while depth > 0 and j + 1 < len(lines):
                j += 1
                depth += lines[j].count('(') - lines[j].count(')')
            for k in range(i + 1, j + 1):
                lines[k] = ''
            continue
        out.append(l)
    lines = [l for l in out if l is not None]
    src = '\n'.join(lines)
    if not removed['fs']: warns.append('useFullscreen line not found')
    # 2c. fullscreenchange sync effect (uses onFsChange or onChange) — drop whole useEffect
    lines = src.split('\n')
    out = []
    i = 0
    dropped_fs_eff = 0
    while i < len(lines):
        if lines[i].strip().startswith('useEffect(') and 'onFsChange' in '\n'.join(lines[i:i+8]):
            depth = 0
            j = i
            while j < len(lines):
                depth += lines[j].count('(') - lines[j].count(')')
                depth += lines[j].count('{') - lines[j].count('}')
                if j > i and depth <= 0 and '}' in lines[j] or (j > i and re.match(r'\s*\}, \[onFsChange\]\)', lines[j])):
                    break
                j += 1
            i = j + 1
            dropped_fs_eff += 1
            continue
        out.append(lines[i]); i += 1
    src = '\n'.join(out)
    if not dropped_fs_eff: warns.append('fullscreenchange effect not found')

    # 3. <ToolLayout + hideHeader -> <GameShell name/start/label/extra>
    m = re.search(r'<ToolLayout', src)
    if not m: print('FAIL: no <ToolLayout'); sys.exit(1)
    extra_prop = f'\n      extraButtons={{{a.extra}}}' if a.extra else ''
    src = src.replace('<ToolLayout', f'<GameShell\n      name="{a.name}"\n      startAction={{{a.start}}} startLabel="{a.label}"{extra_prop}', 1)
    src = re.sub(r'[ \t]*hideHeader=\{isFs\}[ \t]*', ' ', src, count=1)

    # 4a. InterstitialAd line
    src, n = re.subn(r"\s*<InterstitialAd [^/]*/>\n", "\n", src)
    if not n: warns.append('InterstitialAd line not found')
    # 4b. rails: drop ANY div containing vertical GameAdSlots (single-line or multi-line,
    # left slot 3494503358 / right slot 3414612309; some files stack 2 slots in one div,
    # some keep everything on one line)
    src, n1 = re.subn(
        r"\s*(?:\{!isFs &&\s*)?<div className=\"hidden lg:block[^\"]*\">[ \t]*\n?(?:[ \t]*<GameAdSlot[^/]*/>[ \t]*\n?)+[ \t]*</div>(?:\})?\n?",
        "\n", src)
    # 4c. bottom banners
    src, bn = re.subn(r"\s*(?:\{!isFs &&\s*)?<div className=\"(?:w-full max-w-6xl mx-auto px-5(?: mt-2)?|max-w-3xl mx-auto mt-6)\">\s*\n\s*<GameAdSlot slot=\"8865234201\"[^/]*/>\s*\n\s*</div>(?:\})?\n", "\n", src)
    src, bn2 = re.subn(r"\s*<GameAdSlot slot=\"8865234201\" format=\"horizontal\"[^/]*/>\n", "\n", src)
    # 4d2. old START buttons that the shell now owns: a glow-btn whose onClick
    # resolves to the same startAction expr would double-run / go stale.
    # Drop the button ONLY (keep sibling extras like next-piece previews).
    # Runs AFTER the 4f triggerAd rewrite, so match the bare/arrow forms.
    start_id = re.sub(r'^\(\) => ', '', a.start).split('(')[0].strip()
    if start_id and start_id != 'flip':
        # () => startGame  AND  () => { startGame }  AND  bare startGame
        # AND triggerAd(startGame) / () => triggerAd(startGame) (pre-4f safety net)
        src, _ = re.subn(
            r"\s*<button onClick=\{\(\) => \{? ?(?:triggerAd\()? ?" + re.escape(start_id) + r" ?(?:\))? ?\}?\} className=\"glow-btn[^\"]*\">.*?</button>",
            "", src, flags=re.S)
        src, _ = re.subn(
            r"\s*<button onClick=\{(?:triggerAd\()? ?" + re.escape(start_id) + r" ?(?:\))?\} className=\"glow-btn[^\"]*\">.*?</button>",
            "", src, flags=re.S)
    # (matches variants with extra classes like items-center / mt-4)
    src, fn_ = re.subn(
        r"\s*<div className=\"flex gap-[^\"]*justify-center[^\"]*\">\s*\n\s*<button onClick=\{toggleFs\}[^>]*>[^<]*\{isFs \? '⊡' : '⛶'\}\s*\n?\s*</button>\s*\n\s*</div>\n",
        "\n", src)
    # tetris-style mixed row: toggleFs button + start button + extras in one row.
    # Drop ONLY the toggleFs button; the row's start button is handled by triggermap below.
    # (matches px-3 py-2 AND breakout's smaller px-3 py-1.5 variants)
    src = re.sub(
        r"\s*<button onClick=\{toggleFs\} className=\"px-3 py-[^>\"]*\" title=\"Fullscreen\">\s*\n?\s*\{isFs \? '⊡' : '⛶'\}\s*\n?\s*</button>",
        "", src)
    # solitaire inline toggleFs in stats row (keep stats, drop button only)
    src = re.sub(
        r"\s*<button onClick=\{toggleFs\} className=\"px-2 py-1[^\"]*\" title=\"Fullscreen\">\s*\n?\s*\{isFs \? '⊡' : '⛶'\}\s*\n?\s*</button>",
        "", src)
    # 4e. ref={resultRef}
    src = re.sub(r'\s*ref=\{resultRef\}', '', src)
    src = re.sub(r'ref=\{\(el\) => \{ resultRef\.current = el; boardRef\.current = el; \}\}', 'ref={boardRef}', src)
    # 4f. per-file triggerAd call-site rewrites: --tmap "OLD >>> NEW" (repeatable).
    # Default handles bare identifiers. Inline arrows (with args/state) need explicit maps.
    for pair in (a.tmap or []):
        if '>>>' not in pair:
            warns.append(f'bad --tmap (need OLD >>> NEW): {pair}'); continue
        old, new = pair.split('>>>', 1)
        src = src.replace(old, new)
    src = re.sub(r'triggerAd\((\w+)\)', r'\1', src)

    # 5. closing tag
    if '</ToolLayout>' not in src:
        warns.append('no </ToolLayout> found!')
    src = src.replace('</ToolLayout>', '</GameShell>')

    # leftover checks
    for bad in ['ToolLayout', 'useFullscreen', 'GameAdSlot', 'InterstitialAd',
                'toggleFs', 'triggerAd', 'showAd', 'onAdDismiss', 'pendingAction',
                'onFsChange', 'resultRef', 'useJumpToResult', 'hideHeader={isFs}']:
        if bad in src:
            warns.append(f'LEFTOVER: {bad}')

    if a.check:
        print('WARNS:', warns if warns else 'none')
        print(f'lines {len(orig.splitlines())} -> {len(src.splitlines())}')
        return
    open(a.file, 'w').write(src)
    print('WROTE', a.file)
    print('WARNS:', warns if warns else 'none')

main()
