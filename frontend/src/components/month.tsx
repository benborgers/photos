import { useEffect, useState } from "react";
import type { Photo } from "../lib";
import { twMerge } from "tailwind-merge";

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

const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

const pad = (n: number) => n.toString().padStart(2, "0");

export default function Month({
  year,
  month,
  photos,
}: {
  year: number;
  month: number;
  photos: Photo[];
}) {
  const days = [];
  for (let i = 1; i <= daysInMonth(year, month); i++) {
    days.push(i);
  }

  const offset = new Date(year, month - 1, 1).getDay();

  return (
    <div className="rounded-xl overflow-hidden">
      <div className="bg-gray-700/70 px-3 py-2">
        <h2 className="font-bold font-display text-white">
          {MONTH_NAMES[month - 1]} {year}
        </h2>
      </div>
      <div className="bg-gray-800 p-1.5 sm:p-3 grid grid-cols-7 gap-1.5 sm:gap-3">
        {Array.from({ length: offset - 1 })
          .fill(null)
          .map((_, i) => (
            <div key={i} />
          ))}

        {days.map((day) => (
          <Day key={day} day={day} month={month} year={year} photos={photos} />
        ))}
      </div>
    </div>
  );
}

const Day = ({
  day,
  month,
  year,
  photos,
}: {
  day: number;
  month: number;
  year: number;
  photos: Photo[];
}) => {
  const photo = photos.find(
    (p) => p.date === `${year}-${pad(month)}-${pad(day)}`
  );

  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const now = new Date();
    setIsToday(
      now.getDate() === day &&
        now.getMonth() === month - 1 &&
        now.getFullYear() === year
    );
  }, []);

  return (
    <div
      key={day}
      className={twMerge(
        "aspect-square bg-gray-700 rounded-lg overflow-hidden w-full",
        isToday && "ring-2 ring-rose-600 ring-offset-2 ring-offset-gray-800"
      )}
    >
      {photo && (
        <img
          src={`https://wsrv.nl?url=${encodeURIComponent(
            photo.url
          )}&w=200&h=200&fit=cover&output=webp`}
          loading="lazy"
        />
      )}
    </div>
  );
};
