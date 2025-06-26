import { cn } from '@/lib/utils';

interface ServerAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  fallback: string;
}

export function ServerAvatar({ className, fallback, ...props }: ServerAvatarProps) {
  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
        <span className="text-sm font-medium">{fallback}</span>
      </div>
    </div>
  );
}

export function ServerAvatarFallback({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 