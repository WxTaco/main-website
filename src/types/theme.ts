export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: {
    start: string
    end: string
  }
  text: {
    primary: string
    secondary: string
    muted: string
  }
  card: {
    background: string
    border: string
  }
  button: {
    primary: string
    secondary: string
  }
}

export interface Theme {
  id: string
  name: string
  colors: ThemeColors
}

export const defaultThemes: Theme[] = [
  {
    id: 'wrapped-default',
    name: 'Wrapped Default',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#3b82f6',
      background: {
        start: '#0f172a',
        end: '#1e293b'
      },
      text: {
        primary: '#ffffff',
        secondary: '#d1d5db',
        muted: '#9ca3af'
      },
      card: {
        background: 'rgba(17, 24, 39, 0.6)',
        border: 'rgba(75, 85, 99, 0.5)'
      },
      button: {
        primary: '#ec4899',
        secondary: 'rgba(75, 85, 99, 0.8)'
      }
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    colors: {
      primary: '#06b6d4',
      secondary: '#67e8f9',
      accent: '#0ea5e9',
      background: {
        start: '#0c4a6e',
        end: '#164e63'
      },
      text: {
        primary: '#ffffff',
        secondary: '#e0f2fe',
        muted: '#a7f3d0'
      },
      card: {
        background: 'rgba(8, 47, 73, 0.6)',
        border: 'rgba(14, 165, 233, 0.3)'
      },
      button: {
        primary: '#06b6d4',
        secondary: 'rgba(8, 47, 73, 0.8)'
      }
    }
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#eab308',
      background: {
        start: '#7c2d12',
        end: '#9a3412'
      },
      text: {
        primary: '#ffffff',
        secondary: '#fed7aa',
        muted: '#fdba74'
      },
      card: {
        background: 'rgba(124, 45, 18, 0.6)',
        border: 'rgba(249, 115, 22, 0.3)'
      },
      button: {
        primary: '#f97316',
        secondary: 'rgba(124, 45, 18, 0.8)'
      }
    }
  },
  {
    id: 'forest-night',
    name: 'Forest Night',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#059669',
      background: {
        start: '#064e3b',
        end: '#065f46'
      },
      text: {
        primary: '#ffffff',
        secondary: '#d1fae5',
        muted: '#a7f3d0'
      },
      card: {
        background: 'rgba(6, 78, 59, 0.6)',
        border: 'rgba(16, 185, 129, 0.3)'
      },
      button: {
        primary: '#10b981',
        secondary: 'rgba(6, 78, 59, 0.8)'
      }
    }
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#7c3aed',
      background: {
        start: '#581c87',
        end: '#6b21a8'
      },
      text: {
        primary: '#ffffff',
        secondary: '#e9d5ff',
        muted: '#c4b5fd'
      },
      card: {
        background: 'rgba(88, 28, 135, 0.6)',
        border: 'rgba(139, 92, 246, 0.3)'
      },
      button: {
        primary: '#8b5cf6',
        secondary: 'rgba(88, 28, 135, 0.8)'
      }
    }
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#1d4ed8',
      background: {
        start: '#1e3a8a',
        end: '#1e40af'
      },
      text: {
        primary: '#ffffff',
        secondary: '#dbeafe',
        muted: '#93c5fd'
      },
      card: {
        background: 'rgba(30, 58, 138, 0.6)',
        border: 'rgba(59, 130, 246, 0.3)'
      },
      button: {
        primary: '#3b82f6',
        secondary: 'rgba(30, 58, 138, 0.8)'
      }
    }
  },
  {
    id: 'aurora-gradient',
    name: 'Aurora Gradient',
    colors: {
      primary: '#a855f7',
      secondary: '#06b6d4',
      accent: '#10b981',
      background: {
        start: '#1e1b4b',
        end: '#0f766e'
      },
      text: {
        primary: '#ffffff',
        secondary: '#e0e7ff',
        muted: '#a5b4fc'
      },
      card: {
        background: 'rgba(30, 27, 75, 0.7)',
        border: 'rgba(168, 85, 247, 0.3)'
      },
      button: {
        primary: '#a855f7',
        secondary: 'rgba(30, 27, 75, 0.8)'
      }
    }
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    colors: {
      primary: '#ff0080',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: {
        start: '#0a0a0a',
        end: '#1a0033'
      },
      text: {
        primary: '#ffffff',
        secondary: '#ff80ff',
        muted: '#80ffff'
      },
      card: {
        background: 'rgba(26, 0, 51, 0.8)',
        border: 'rgba(255, 0, 128, 0.4)'
      },
      button: {
        primary: '#ff0080',
        secondary: 'rgba(26, 0, 51, 0.9)'
      }
    }
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#dc2626',
      background: {
        start: '#7c2d12',
        end: '#dc2626'
      },
      text: {
        primary: '#ffffff',
        secondary: '#fef3c7',
        muted: '#fde68a'
      },
      card: {
        background: 'rgba(124, 45, 18, 0.7)',
        border: 'rgba(245, 158, 11, 0.4)'
      },
      button: {
        primary: '#f59e0b',
        secondary: 'rgba(124, 45, 18, 0.8)'
      }
    }
  },
  {
    id: 'cosmic-purple',
    name: 'Cosmic Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#ec4899',
      background: {
        start: '#1e1b4b',
        end: '#581c87'
      },
      text: {
        primary: '#ffffff',
        secondary: '#e9d5ff',
        muted: '#c4b5fd'
      },
      card: {
        background: 'rgba(30, 27, 75, 0.7)',
        border: 'rgba(139, 92, 246, 0.4)'
      },
      button: {
        primary: '#8b5cf6',
        secondary: 'rgba(30, 27, 75, 0.8)'
      }
    }
  },
  {
    id: 'emerald-dream',
    name: 'Emerald Dream',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#06b6d4',
      background: {
        start: '#064e3b',
        end: '#0f766e'
      },
      text: {
        primary: '#ffffff',
        secondary: '#d1fae5',
        muted: '#a7f3d0'
      },
      card: {
        background: 'rgba(6, 78, 59, 0.7)',
        border: 'rgba(16, 185, 129, 0.4)'
      },
      button: {
        primary: '#10b981',
        secondary: 'rgba(6, 78, 59, 0.8)'
      }
    }
  },
  {
    id: 'volcanic-fire',
    name: 'Volcanic Fire',
    colors: {
      primary: '#dc2626',
      secondary: '#f97316',
      accent: '#eab308',
      background: {
        start: '#7f1d1d',
        end: '#dc2626'
      },
      text: {
        primary: '#ffffff',
        secondary: '#fecaca',
        muted: '#fca5a5'
      },
      card: {
        background: 'rgba(127, 29, 29, 0.7)',
        border: 'rgba(220, 38, 38, 0.4)'
      },
      button: {
        primary: '#dc2626',
        secondary: 'rgba(127, 29, 29, 0.8)'
      }
    }
  },
  {
    id: 'arctic-frost',
    name: 'Arctic Frost',
    colors: {
      primary: '#06b6d4',
      secondary: '#67e8f9',
      accent: '#3b82f6',
      background: {
        start: '#0c4a6e',
        end: '#075985'
      },
      text: {
        primary: '#ffffff',
        secondary: '#e0f2fe',
        muted: '#bae6fd'
      },
      card: {
        background: 'rgba(12, 74, 110, 0.7)',
        border: 'rgba(6, 182, 212, 0.4)'
      },
      button: {
        primary: '#06b6d4',
        secondary: 'rgba(12, 74, 110, 0.8)'
      }
    }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#f59e0b',
      background: {
        start: '#881337',
        end: '#be185d'
      },
      text: {
        primary: '#ffffff',
        secondary: '#fce7f3',
        muted: '#f9a8d4'
      },
      card: {
        background: 'rgba(136, 19, 55, 0.7)',
        border: 'rgba(236, 72, 153, 0.4)'
      },
      button: {
        primary: '#ec4899',
        secondary: 'rgba(136, 19, 55, 0.8)'
      }
    }
  },
  {
    id: 'matrix-green',
    name: 'Matrix Green',
    colors: {
      primary: '#00ff41',
      secondary: '#39ff14',
      accent: '#00ff00',
      background: {
        start: '#000000',
        end: '#001100'
      },
      text: {
        primary: '#00ff41',
        secondary: '#39ff14',
        muted: '#008f11'
      },
      card: {
        background: 'rgba(0, 17, 0, 0.8)',
        border: 'rgba(0, 255, 65, 0.3)'
      },
      button: {
        primary: '#00ff41',
        secondary: 'rgba(0, 17, 0, 0.9)'
      }
    }
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    colors: {
      primary: '#ff006e',
      secondary: '#8338ec',
      accent: '#ffbe0b',
      background: {
        start: '#240046',
        end: '#3c096c'
      },
      text: {
        primary: '#ffffff',
        secondary: '#ff77ff',
        muted: '#cc88ff'
      },
      card: {
        background: 'rgba(36, 0, 70, 0.8)',
        border: 'rgba(255, 0, 110, 0.4)'
      },
      button: {
        primary: '#ff006e',
        secondary: 'rgba(36, 0, 70, 0.9)'
      }
    }
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    colors: {
      primary: '#0077be',
      secondary: '#00a8cc',
      accent: '#40e0d0',
      background: {
        start: '#001122',
        end: '#003366'
      },
      text: {
        primary: '#ffffff',
        secondary: '#b3e5fc',
        muted: '#81d4fa'
      },
      card: {
        background: 'rgba(0, 17, 34, 0.8)',
        border: 'rgba(0, 119, 190, 0.3)'
      },
      button: {
        primary: '#0077be',
        secondary: 'rgba(0, 17, 34, 0.9)'
      }
    }
  },
  {
    id: 'autumn-leaves',
    name: 'Autumn Leaves',
    colors: {
      primary: '#d2691e',
      secondary: '#ff8c00',
      accent: '#ffd700',
      background: {
        start: '#8b4513',
        end: '#a0522d'
      },
      text: {
        primary: '#ffffff',
        secondary: '#ffe4b5',
        muted: '#deb887'
      },
      card: {
        background: 'rgba(139, 69, 19, 0.7)',
        border: 'rgba(210, 105, 30, 0.4)'
      },
      button: {
        primary: '#d2691e',
        secondary: 'rgba(139, 69, 19, 0.8)'
      }
    }
  },
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    colors: {
      primary: '#0080ff',
      secondary: '#00bfff',
      accent: '#87ceeb',
      background: {
        start: '#001a33',
        end: '#003366'
      },
      text: {
        primary: '#ffffff',
        secondary: '#e6f3ff',
        muted: '#b3d9ff'
      },
      card: {
        background: 'rgba(0, 26, 51, 0.8)',
        border: 'rgba(0, 128, 255, 0.3)'
      },
      button: {
        primary: '#0080ff',
        secondary: 'rgba(0, 26, 51, 0.9)'
      }
    }
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    colors: {
      primary: '#ff69b4',
      secondary: '#ffb6c1',
      accent: '#ffc0cb',
      background: {
        start: '#4a0e2d',
        end: '#6b1e3f'
      },
      text: {
        primary: '#ffffff',
        secondary: '#ffe4e1',
        muted: '#ffcccb'
      },
      card: {
        background: 'rgba(74, 14, 45, 0.8)',
        border: 'rgba(255, 105, 180, 0.3)'
      },
      button: {
        primary: '#ff69b4',
        secondary: 'rgba(74, 14, 45, 0.9)'
      }
    }
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    colors: {
      primary: '#9932cc',
      secondary: '#ba55d3',
      accent: '#da70d6',
      background: {
        start: '#2e0854',
        end: '#4b0082'
      },
      text: {
        primary: '#ffffff',
        secondary: '#e6e6fa',
        muted: '#dda0dd'
      },
      card: {
        background: 'rgba(46, 8, 84, 0.8)',
        border: 'rgba(153, 50, 204, 0.3)'
      },
      button: {
        primary: '#9932cc',
        secondary: 'rgba(46, 8, 84, 0.9)'
      }
    }
  },
  {
    id: 'lime-zest',
    name: 'Lime Zest',
    colors: {
      primary: '#32cd32',
      secondary: '#7fff00',
      accent: '#adff2f',
      background: {
        start: '#0d2818',
        end: '#1a4d2e'
      },
      text: {
        primary: '#ffffff',
        secondary: '#f0fff0',
        muted: '#98fb98'
      },
      card: {
        background: 'rgba(13, 40, 24, 0.8)',
        border: 'rgba(50, 205, 50, 0.3)'
      },
      button: {
        primary: '#32cd32',
        secondary: 'rgba(13, 40, 24, 0.9)'
      }
    }
  }
]
