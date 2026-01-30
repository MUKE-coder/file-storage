import { Skeleton } from "@/components/ui/skeleton";

export default function TableLoading() {
  return (
    <tbody className="divide-y divide-slate-100">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <tr key={i} className="group hover:bg-slate-50/80 transition-all">
          {/* Category Name with image */}
          <td className="px-8 py-5">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-sm shrink-0" />
              <Skeleton className="h-4 w-32" />
            </div>
          </td>

          {/* Slug */}
          <td className="px-8 py-5">
            <Skeleton className="h-4 w-24" />
          </td>

          {/* Products */}
          <td className="px-8 py-5">
            <Skeleton className="h-6 w-16 rounded-full" />
          </td>

          {/* Status */}
          <td className="px-8 py-5">
            <Skeleton className="h-7 w-20 rounded-xl" />
          </td>

          {/* Last Updated */}
          <td className="px-8 py-5">
            <Skeleton className="h-4 w-28" />
          </td>

          {/* Actions */}
          <td className="px-8 py-5 text-right">
            <div className="flex justify-end gap-1">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="w-9 h-9 rounded-xl" />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
