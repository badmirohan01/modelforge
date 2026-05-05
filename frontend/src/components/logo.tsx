import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 200 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto", className)}
    >
      <path
        d="M3 6H5V26H3V6ZM13 6H15V26H13V6ZM18 9V11H0V9H18ZM0 23V21H18V23H0Z"
        fill="url(#logo-gradient)"
      />
      <text
        x="24"
        y="23"
        fill="currentColor"
        className="text-xl font-black italic tracking-tighter"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        MODEL<tspan fill="#3b82f6">FORGE</tspan>
      </text>
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="10"
          y1="0"
          x2="10"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
};
