import Calendar from "@/components/calendar";

export default function Index() {
  return (
    <div className="px-3 pt-8 sm:pt-16 pb-24">
      <div className="mx-auto max-w-xl flex items-end justify-between">
        <h1 className="sm:text-lg text-white font-display font-bold bg-rose-600 px-2 rounded-md">
          Photo of the Day
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          A project by{" "}
          <a
            href="https://ben.page"
            target="_blank"
            className="underline decoration-gray-700 hover:text-white hover:decoration-white transition-colors"
          >
            Ben Borgers
          </a>
        </p>
      </div>
      <div className="mt-7 mx-auto max-w-xl">
        <Calendar />
      </div>
    </div>
  );
}
