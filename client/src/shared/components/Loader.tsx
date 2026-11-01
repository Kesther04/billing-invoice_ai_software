export default function Loader() {
  return (
    <div className="relative flex items-center justify-center py-20">
      <span className="absolute w-8 h-8 rounded-full border-2 border-emerald-500/30 animate-ping" />
      <span className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );
}