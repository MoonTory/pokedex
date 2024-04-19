import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  width?: number;
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
}

export const LoadingSkeleton: React.FC<Props> = ({
  width = 100,
  className = `h-4 w-[${width}px]`,
  children,
  isLoading,
  skeletonProps,
}) => (
  <div className="flex justify-center">
    {isLoading ? (
      <Skeleton className={className} {...skeletonProps} />
    ) : (
      children
    )}
  </div>
);

export default LoadingSkeleton;
