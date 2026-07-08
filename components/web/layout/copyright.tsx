export function Copyright({ date, name }: { date: string; name: string }) {
  return (
    <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 min-[1320px]:px-0 md:flex-row md:gap-0 md:px-4">
        <p>
          &copy; {date} Vladyslav Petlia | {name}
          {name.length && !name.endsWith(".") ? "." : ""} All rights reserved.
        </p>
      </div>
    </div>
  )
}
