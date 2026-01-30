// components/ui/QueryErrorDisplay.tsx
interface QueryErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  title?: string;
  retryText?: string;
}

export function QueryErrorDisplay({
  error,
  onRetry,
  title = "Something went wrong",
  retryText = "Try Again",
}: QueryErrorDisplayProps) {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">
          {error.message || "Failed to load data. Please try again."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-zinc-900 text-white px-6 py-2 rounded-md hover:bg-zinc-800 transition-colors"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}
