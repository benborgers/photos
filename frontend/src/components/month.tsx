import type { Photo } from "../lib";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Month({
  year,
  month,
  photos,
}: {
  year: number;
  month: number;
  photos: Photo[];
}) {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="bg-gray-700/70 px-3 py-2">
        <h2 className="font-bold font-display text-white">
          {MONTH_NAMES[month - 1]} {year}
        </h2>
      </div>
      <div className="bg-gray-800 p-3">hi</div>
    </div>
  );
}
