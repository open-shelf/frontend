import Image from "next/image";

interface BookProps {
  title: string;
  subtitle: string;
  isRounded?: boolean;
}

export default function Book({
  title,
  subtitle,
  isRounded = false,
}: BookProps) {
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div
        className={`relative w-32 h-48 mb-2 bg-primary shadow-md overflow-hidden ${
          isRounded ? "rounded-full" : "rounded-xl"
        }`}
      >
        <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-80 text-primary text-xs px-2 py-1 rounded-full text-center">
          {subtitle}
        </div>
      </div>
      <span className="text-sm text-center w-32 overflow-hidden text-ellipsis text-gray-800">
        {title}
      </span>
    </div>
  );
}
