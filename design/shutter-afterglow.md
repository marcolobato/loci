# ser o estar — Shutter + Afterglow motion spec

## Shutter (live capture button)
- Outer ring: 76px (splash) / 44px (inline), 3px / 2px stroke #E3EBE8, transparent fill
- Gap: 5px / 3px between ring and disc (ground shows through)
- Inner disc: #A8E6CF (mint = "live", reserved for capture/recording only)
- Min hit target: 48px

```css
.shutter{width:76px;height:76px;box-sizing:border-box;border-radius:50%;border:3px solid #E3EBE8;padding:5px;animation:sx-pulse 2.4s ease-out infinite}
.shutter__disc{width:100%;height:100%;border-radius:50%;background:#A8E6CF;animation:sx-breathe 2.4s ease-in-out infinite}
.shutter:active .shutter__disc{transform:scale(.86);transition:transform 120ms cubic-bezier(.2,0,0,1)}
@keyframes sx-pulse{0%{box-shadow:0 0 0 0 rgba(168,230,207,.45)}70%,100%{box-shadow:0 0 0 12px rgba(168,230,207,0)}}
@keyframes sx-breathe{0%,100%{transform:scale(1)}50%{transform:scale(.94)}}
```

## Wordmark afterglow (estar only — ser never animates)
6s, ease-in-out, infinite alternate. Warm → cold → dim.
```css
@keyframes sx-afterglow{
  0%,12%{color:#EDB48F;text-shadow:0 0 22px rgba(237,180,143,.55);opacity:1}
  45%{color:#DDB9A6;text-shadow:0 0 10px rgba(237,180,143,.25);opacity:1}
  80%{color:#B9CCDD;text-shadow:none;opacity:.8}
  100%{color:#86A3B0;text-shadow:none;opacity:.5}
}
```

## Decay (transitions/loading, <2s)
Per letter of "estar", delay = (4 - index) * 0.45s, 6s alternate:
`@keyframes sx-decay{0%,20%{opacity:1;filter:blur(0)}70%,100%{opacity:.1;filter:blur(3px)}}`

## Afterimage
Cold copy (#B9CCDD) behind estar, 3.2s ease-out infinite:
`@keyframes sx-ghost{0%{opacity:.55;transform:translateX(0);filter:blur(0)}100%{opacity:0;transform:translateX(22px);filter:blur(7px)}}`

## Afterglow ramp (capture age → accent color)
now #EDB48F · 1 hr #DDB9A6 · 1 day #C6C3BF · 1 week #B0C6D3 · 1 month #86A3B0
Light theme warm: #A5562A

## Respect reduced motion
`@media (prefers-reduced-motion: reduce){*{animation:none!important}}` — show the static "now" color.
