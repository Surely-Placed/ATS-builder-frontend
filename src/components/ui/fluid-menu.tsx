"use client"

import React, { useState, useRef, useEffect } from "react"

interface MenuItemProps {
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
  isActive?: boolean
}

export function MenuItem({ children, onClick, disabled = false, icon, isActive = false }: MenuItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`relative block w-full h-12 text-center group
        ${disabled ? "text-gray-400 dark:text-gray-500 cursor-not-allowed" : "text-foreground cursor-pointer"}
        ${isActive ? "bg-white/10" : ""}
      `}
      role="menuitem"
      onClick={handleClick}
      disabled={disabled}
      type="button"
      style={{ 
        pointerEvents: disabled ? 'none' : 'auto',
        zIndex: 1000
      }}
    >
      <span className="flex items-center justify-center h-full pointer-events-none">
        {icon && (
          <span className="h-5 w-5 transition-all duration-200 group-hover:[&_svg]:stroke-[2.5] pointer-events-none">
            {icon}
          </span>
        )}
        {children}
      </span>
    </button>
  )
}

interface MenuContainerProps {
  children: React.ReactNode;
  onItemClick?: () => void;
  isExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export function MenuContainer({ 
  children, 
  onItemClick,
  isExpanded: controlledExpanded,
  onToggle
}: MenuContainerProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded
  const setIsExpanded = onToggle || ((value: boolean) => setInternalExpanded(value))
  
  const childrenArray = React.Children.toArray(children)
  const totalItems = childrenArray.length

  const handleToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
  }

  // Close menu when clicking outside
  useEffect(() => {
    if (isExpanded) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('[data-menu-container]')) {
          setIsExpanded(false);
        }
      };
      // Use capture phase to catch events before they bubble
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => document.removeEventListener('mousedown', handleClickOutside, true);
    }
  }, [isExpanded, setIsExpanded]);

  return (
    <div className="relative w-[48px]" data-expanded={isExpanded} data-menu-container>
      {/* Container for all items */}
      <div className="relative">
        {/* First item - always visible */}
        <div 
          className="relative w-12 h-12 bg-gradient-to-br from-primary/90 to-primary cursor-pointer rounded-full group will-change-transform z-50 shadow-lg shadow-primary/20 hover:shadow-primary/30 border border-primary/30"
        >
          {childrenArray[0]}
        </div>

        {/* Other items */}
        {childrenArray.slice(1).map((child, index) => (
          <div 
            key={index} 
            className="absolute top-0 left-0 w-12 h-12 bg-card/90 backdrop-blur-xl border border-border will-change-transform rounded-full shadow-md hover:shadow-lg cursor-pointer"
            style={{
              transform: `translateY(${isExpanded ? (index + 1) * 56 : 0}px)`,
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? 'auto' : 'none',
              zIndex: 40 - index,
              clipPath: "circle(50% at 50% 50%)",
              transition: `transform ${isExpanded ? '300ms' : '300ms'} cubic-bezier(0.4, 0, 0.2, 1),
                         opacity ${isExpanded ? '300ms' : '350ms'}`,
              backfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitFontSmoothing: 'antialiased'
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
