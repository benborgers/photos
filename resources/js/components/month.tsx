import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { usePage } from "@inertiajs/react";
import type { Photo } from "../lib/types";

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
  onPhotoClick,
}: {
  year: number;
  month: number;
  onPhotoClick: (photo: Photo) => void;
}) {
  const props = usePage().props;
  const photos = props.photos as Photo[];

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

        {days.map((day) => {
          const photo = photos.find(
            (p) => p.date === `${year}-${pad(month)}-${pad(day)}`
          );
          return (
            <Day
              key={day}
              year={year}
              month={month}
              day={day}
              photo={photo}
              onClick={() => {
                if (photo) {
                  onPhotoClick(photo);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

const Day = ({
  year,
  month,
  day,
  photo,
  onClick,
}: {
  year: number;
  month: number;
  day: number;
  photo?: Photo;
  onClick: () => void;
}) => {
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
          src={photo.thumbnail_url}
          loading="lazy"
          className="cursor-zoom-in"
          onClick={onClick}
        />
      )}
    </div>
  );
};
