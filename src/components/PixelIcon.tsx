import type { ReactNode } from 'react'

export type PixelIconName = 'computer' | 'folder' | 'note' | 'mail' | 'github' | 'bolt' | 'robot' | 'compass' | 'cubes' | 'start' | 'telegram' | 'back'

// A single 32-unit grid; geometry stays crisp at desktop and title-bar sizes.
export function PixelIcon({ name, size = 32 }: { name: PixelIconName; size?: number }) {
  const icons: Record<PixelIconName, ReactNode> = {
    computer: <><path fill="#dad5b9" d="M5 2h21v22H5zM2 25h28v5H2z" /><path fill="#fffce7" d="M7 4h17v17H7z" /><path fill="#102778" d="M9 6h13v12H9z" /><path stroke="#fff" d="m11 9 3 2-3 2m5 1h4" /><path fill="#8e8c7b" d="M7 23h18v3H7zM23 28h4" /></>,
    folder: <><path fill="#e9b91e" d="M3 5h11l3 4h12v20H2V7h1z" /><path fill="#fff0a0" d="M3 10h26v4H3z" /><path fill="#ffd839" d="M3 13h27l-2 16H2z" /><path stroke="#fff7bf" d="M5 16h21M5 18v8" /></>,
    note: <><path fill="#fffdf0" d="M6 2h17l4 4v25H6z" /><path fill="#bdd7db" d="M6 2h4v29H6z" /><path stroke="#596271" d="M12 9h10M12 13h10M12 17h10M12 21h8M12 25h8" /><path fill="#ffe14b" d="m16 23 10-15 4 3-10 15-5 2z" /><path fill="#ee6f61" d="m26 8 2-3 4 3-2 3" /></>,
    mail: <><path fill="#fdfbed" d="M2 6h28v21H2z" /><path stroke="#1e5593" d="m3 7 13 11L29 7M3 26l9-10m17 10-9-10" /><path stroke="#e45445" strokeDasharray="3 3" d="M3 7h26v19H3z" /></>,
    github: <><path fill="#20242a" d="M5 9V3l7 4h8l7-4v8l3 5v8l-5 5H8l-6-6v-8z" /><path fill="#fff0d7" d="M8 15h17v10H8z" /><path stroke="#20242a" d="M12 18v3m8-3v3m-7 4h6" /><path fill="#20242a" d="M12 28h8v4h-8z" /></>,
    bolt: <path fill="#ffda28" d="M15 2h13l-9 11h7L10 31l3-14H5z" />,
    robot: <><path stroke="#222" d="M16 3v5" /><path fill="#ffd83e" d="M14 1h4v4h-4z" /><path fill="#c9dedc" d="M5 10h22v16H5zM2 14h3v9H2zM27 14h3v9h-3z" /><path fill="#1674b9" d="M9 13h14v10H9z" /><path stroke="#fff6a0" d="M12 16v4m8-4v4" /><path stroke="#222" d="M10 28h12" /></>,
    compass: <><path fill="#3b98d5" d="M10 2h12l8 8v12l-8 8H10l-8-8V10z" /><path fill="#d4edf1" d="M11 5h10l6 6v10l-6 6H11l-6-6V11z" /><path fill="#dc5144" d="m23 8-5 11-10 5 5-11z" /><path fill="#fff" d="m13 13 5 6-10 5z" /></>,
    cubes: <><path fill="#56b9f0" d="m16 1 9 5v10l-9 5-9-5V6z" /><path fill="#ffe251" d="m7 13 9 5v10l-9 4-7-4V18z" /><path fill="#ef809c" d="m24 13 8 5v10l-8 4-8-4V18z" /><path fill="none" d="m7 18 9-5m8 5 8-5M16 1v10l9-5m-9 5L7 6M7 23v9m17-9v9" /></>,
    start: <><path fill="#ee5546" d="M2 4h11v10H2z" /><path fill="#36b14b" d="M17 2h12v12H17z" /><path fill="#328ad5" d="M2 18h11v10H2z" /><path fill="#f8d345" d="M17 18h12v12H17z" /></>,
    telegram: <><path fill="#28a8e8" d="m1 14 29-12-5 28-10-8-6 5 2-10z" /><path stroke="#fff" d="m11 17 14-9-10 14" /></>,
    back: <path fill="#f7f6ed" d="m3 16 12-12v8h14v8H15v8z" />,
  }
  return <svg className="pixel-icon" width={size} height={size} viewBox="0 0 34 34" fill="none" stroke="#20242a" strokeWidth="1.6" strokeLinejoin="miter" shapeRendering="crispEdges" aria-hidden="true"><g transform="translate(1 1)">{icons[name]}</g></svg>
}
