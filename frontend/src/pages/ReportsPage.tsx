import { BarChart3 } from 'lucide-react';

export function ReportsPage() {
  return (
    <div className="space-y-5">
      <section className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <BarChart3 className="h-7 w-7 text-brand-sky" />
        <p className="mt-3 text-sm font-medium text-slate-600">
          Score distribution charts will be available here.
        </p>
      </section>
    </div>
  );
}
