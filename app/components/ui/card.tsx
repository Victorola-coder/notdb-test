interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-[#1a1a1a] border border-[#333] rounded-[24px] p-5 animate-float ${className}`}
    >
      {children}
    </div>
  );
}
