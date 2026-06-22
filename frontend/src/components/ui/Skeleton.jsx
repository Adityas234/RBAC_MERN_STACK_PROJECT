export default function Skeleton({
  variant = "text",
  className = "",
  count = 1
}) {
  const baseClass = "bg-slate-200 shimmer-wrapper rounded-lg";

  const renderSkeleton = (key) => {
    switch (variant) {
      case "avatar":
        return <div key={key} className={`${baseClass} h-10 w-10 rounded-full ${className}`} />;
      case "card":
        return (
          <div key={key} className={`border border-slate-100 rounded-2xl bg-white p-6 shadow-premium flex flex-col gap-4 ${className}`}>
            <div className="flex justify-between items-center">
              <div className={`${baseClass} h-6 w-1/3`} />
              <div className={`${baseClass} h-4 w-12 rounded-full`} />
            </div>
            <div className="flex flex-col gap-2">
              <div className={`${baseClass} h-4 w-full`} />
              <div className={`${baseClass} h-4 w-5/6`} />
            </div>
            <div className="flex gap-2 items-center mt-2">
              <div className={`${baseClass} h-8 w-8 rounded-full`} />
              <div className={`${baseClass} h-4 w-20`} />
            </div>
          </div>
        );
      case "table-row":
        return (
          <tr key={key} className="border-b border-slate-100 animate-pulse">
            <td className="p-4"><div className={`${baseClass} h-4 w-24`} /></td>
            <td className="p-4"><div className={`${baseClass} h-4 w-36`} /></td>
            <td className="p-4"><div className={`${baseClass} h-4 w-16`} /></td>
            <td className="p-4"><div className={`${baseClass} h-8 w-20`} /></td>
          </tr>
        );
      case "log-item":
        return (
          <div key={key} className="flex items-center gap-4 p-4 border border-slate-100 bg-white rounded-xl shadow-premium animate-pulse">
            <div className={`${baseClass} h-8 w-8 rounded-lg`} />
            <div className="flex-1 flex flex-col gap-2">
              <div className={`${baseClass} h-4 w-1/4`} />
              <div className={`${baseClass} h-3 w-1/2`} />
            </div>
            <div className={`${baseClass} h-4 w-24`} />
          </div>
        );
      case "title":
        return <div key={key} className={`${baseClass} h-8 w-1/3 ${className}`} />;
      case "subtitle":
        return <div key={key} className={`${baseClass} h-4 w-1/2 ${className}`} />;
      case "text":
      default:
        return <div key={key} className={`${baseClass} h-4 w-full ${className}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </>
  );
}
