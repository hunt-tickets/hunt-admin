import { cn } from "@/lib/utils"

interface ProgressBarProps {
  progress: number // 0-100
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ progress, className, showLabel = false }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  
  return (
    <div className={cn("space-y-1", className)}>
      <div className="w-full bg-surface-elevated rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-interactive-primary to-interactive-active transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-secondary">
          <span>0%</span>
          <span className="text-text-primary font-medium">{clampedProgress}%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  )
}