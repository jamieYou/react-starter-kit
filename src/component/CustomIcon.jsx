import React from 'react'
import type { SpriteSymbol } from '@constants'

type propsType = {
  spriteSymbol: SpriteSymbol,
  className?: string,
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg',
}

export default function CustomIcon({ spriteSymbol, className = '', size = 'md' }: propsType) {
  return (
    <svg className={`am-icon am-icon-${spriteSymbol.id} am-icon-${size} ${className}`}>
      <use xlinkHref={`#${spriteSymbol.id}`}/>
    </svg>
  )
}
