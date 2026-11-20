import { Loader2, Search } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

const SAMPLE_REGISTRATIONS = [
  { sbd: '01000001', hint: 'Natural Science' },
  { sbd: '01000002', hint: 'Social Science' },
];

interface ScoreSearchFormProps {
  initialValue?: string;
  isLoading: boolean;
  onSubmit: (sbd: string) => void;
}

export function ScoreSearchForm({
  initialValue = '',
  isLoading,
  onSubmit,
}: ScoreSearchFormProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleChange = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, 8);
    setInputValue(digitsOnly);
    if (validationMessage && /^\d{8}$/.test(digitsOnly)) {
      setValidationMessage(null);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = inputValue.trim();

    if (!/^\d{8}$/.test(cleaned)) {
      setValidationMessage('Registration number must be exactly 8 digits.');
      return;
    }

    setValidationMessage(null);
    onSubmit(cleaned);
  };

  const triggerQuickSearch = (sbd: string) => {
    setInputValue(sbd);
    setValidationMessage(null);
    onSubmit(sbd);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-brand-navy">User Registration</h2>

      <form onSubmit={handleSubmit} className="mt-3" noValidate>
        <label htmlFor="registration-number" className="block text-sm font-medium text-slate-700">
          Registration Number
        </label>
        <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="registration-number"
              name="sbd"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={8}
              value={inputValue}
              onChange={(event) => handleChange(event.target.value)}
              placeholder="e.g. 01000001"
              aria-invalid={Boolean(validationMessage)}
              aria-describedby={validationMessage ? 'sbd-validation-error' : undefined}
              className={[
                'w-full rounded-md border bg-white py-2 pl-9 pr-14 text-sm font-medium tracking-wider text-slate-900 focus:outline-none',
                validationMessage ? 'border-rose-400' : 'border-slate-300',
              ].join(' ')}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              {inputValue.length}/8
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-brand-yellow px-5 py-2 text-sm font-semibold text-brand-navy transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {validationMessage && (
          <p id="sbd-validation-error" className="mt-2 text-xs font-medium text-rose-600">
            {validationMessage}
          </p>
        )}
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3.5">
        <span className="text-xs font-medium text-slate-500">Sample:</span>
        {SAMPLE_REGISTRATIONS.map((sample) => (
          <button
            key={sample.sbd}
            type="button"
            disabled={isLoading}
            onClick={() => triggerQuickSearch(sample.sbd)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-brand-navy transition hover:border-brand-sky hover:bg-brand-sky/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="font-mono font-semibold">{sample.sbd}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{sample.hint}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
