export type ClassicIconName =
  | 'code'
  | 'layers'
  | 'compass'
  | 'tool'
  | 'globe'
  | 'people'
  | 'climbing'
  | 'crafting'
  | 'swimming'
  | 'traveling'
  | 'phone'
  | 'email'
  | 'github'
  | 'linkedin'
  | 'download'
  | 'user'
  | 'graduation'
  | 'briefcase'
  | 'rocket'
  | 'file'
  | 'external'

type ClassicIconProps = {
  name: ClassicIconName
}

export function ClassicIcon({ name }: ClassicIconProps) {
  const commonProps = {
    className: 'classic-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    'data-icon': name,
  }

  switch (name) {
    case 'code':
      return <svg {...commonProps}><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>
    case 'layers':
      return <svg {...commonProps}><path d="m12 3-9 5 9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>
    case 'compass':
      return <svg {...commonProps}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>
    case 'tool':
      return <svg {...commonProps}><path d="M14.5 6.5a4 4 0 0 0-5-5l2.2 2.2-2.8 2.8-2.2-2.2a4 4 0 0 0 5 5L20 17.6 17.6 20l-8.3-8.3" /></svg>
    case 'globe':
      return <svg {...commonProps}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
    case 'people':
      return <svg {...commonProps}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20a6 6 0 0 1 12 0M15 15a4.5 4.5 0 0 1 6 4" /></svg>
    case 'climbing':
      return <svg {...commonProps}><path d="M3 21 12 4l9 17M8 21l4-7 4 7" /><circle cx="16" cy="6" r="1.5" /></svg>
    case 'crafting':
      return <svg {...commonProps}><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="m8.5 15.5 8-11M15.5 15.5l-8-11M9.5 8h5" /></svg>
    case 'swimming':
      return <svg {...commonProps}><circle cx="17" cy="6" r="2" /><path d="m4 13 5-3 4 3 4-3 3 2M3 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 2 2" /></svg>
    case 'traveling':
      return <svg {...commonProps}><path d="m21 3-7 18-3-8-8-3 18-7Z" /><path d="m11 13 4-4" /></svg>
    case 'phone':
      return <svg {...commonProps}><path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1.2 3a16 16 0 0 1-10.8-10.8L8 7 7 3Z" /></svg>
    case 'email':
      return <svg {...commonProps}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg>
    case 'github':
      return <svg {...commonProps}><circle cx="6" cy="5" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="19" r="2" /><path d="M6 7v3c0 2 2 3 4 3h2M18 8v3c0 2-2 3-4 3h-2v3" /></svg>
    case 'linkedin':
      return <svg {...commonProps}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v7M8 7v.01M12 17v-4a3 3 0 0 1 6 0v4M12 10v7" /></svg>
    case 'download':
      return <svg {...commonProps}><path d="M12 3v12M7 11l5 5 5-5M4 21h16" /></svg>
    case 'user':
      return <svg {...commonProps}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
    case 'graduation':
      return <svg {...commonProps}><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11.5V16c3 2.7 9 2.7 12 0v-4.5M22 9v6" /></svg>
    case 'briefcase':
      return <svg {...commonProps}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" /></svg>
    case 'rocket':
      return <svg {...commonProps}><path d="M14 4c3-2 6-1 6-1s1 3-1 6l-6 6-4-4 5-7Z" /><path d="m9 11-4 1-2 3 6 1M13 15l-1 4-3 2-1-6" /><circle cx="16" cy="7" r="1.5" /></svg>
    case 'file':
      return <svg {...commonProps}><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h4M9 13h6M9 17h6" /></svg>
    case 'external':
      return <svg {...commonProps}><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v6H5V6h6" /></svg>
  }
}
