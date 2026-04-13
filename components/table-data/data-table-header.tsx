export default function DataTableHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex w-full items-center justify-between border-b-2  bg-gradient-to-r from-[#243748] to-[#4B749F] text-white text-white px-2 py-2 backdrop-blur-sm dark:bg-neutral-900 shadow-xm rounded-sm ">
      {/* Title */}
      <div className="flex items-center gap-2">
        {/* <div className="h-5 w-1 rounded-full bg-gradient-to-b from-blue-200 via-blue-400 to-indigo-500" /> */}
        <h1 className="font-bold text-white text-lg dark:text-gray-100">
          {title}
        </h1>
      </div>

      {/* Actions */}
      {children}
    </header>
  );
}
