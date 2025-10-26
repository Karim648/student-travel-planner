export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-pulse">
      <div className="h-64 w-full rounded-xl bg-gray-200" />
      <div className="h-6 w-1/3 mt-6 bg-gray-200 rounded" />
      <div className="h-4 w-2/3 mt-3 bg-gray-200 rounded" />
    </div>
  );
}
