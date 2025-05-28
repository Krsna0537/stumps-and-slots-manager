
import React, { useEffect, useRef } from 'react';

interface AccessibilityWrapperProps {
  children: React.ReactNode;
  announceOnMount?: string;
  focusOnMount?: boolean;
  role?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export const AccessibilityWrapper: React.FC<AccessibilityWrapperProps> = ({
  children,
  announceOnMount,
  focusOnMount = false,
  role,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusOnMount && wrapperRef.current) {
      wrapperRef.current.focus();
    }

    if (announceOnMount && announcementRef.current) {
      announcementRef.current.textContent = announceOnMount;
      // Clear the announcement after a short delay
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = '';
        }
      }, 1000);
    }
  }, [announceOnMount, focusOnMount]);

  return (
    <div
      ref={wrapperRef}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      tabIndex={focusOnMount ? -1 : undefined}
    >
      {announceOnMount && (
        <div
          ref={announcementRef}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      )}
      {children}
    </div>
  );
};

// Utility hook for keyboard navigation
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEnter, onEscape, onArrowUp, onArrowDown]);
};
