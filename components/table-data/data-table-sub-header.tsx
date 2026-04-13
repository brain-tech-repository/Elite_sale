export default function DataTableSubHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="flex w-full items-center justify-between 
      border-b-1 border-s-1  border-neutral-300 dark:border-neutral-800 
      px-3 py-2 shadow-xm bg-gradient-to-r from-[#243748] to-[#4B749F] text-white text-white rounded-sm"
    >
      {/* Title Section */}
      <div className="flex items-center gap-2">
        {/* Accent line */}
        {/* <div className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-200 via-blue-400 to-indigo-500" /> */}

        <h2
          className="text-sm font-semibold 
          text-white dark:text-neutral-600 
          tracking-wide"
        >
          {title}
        </h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
