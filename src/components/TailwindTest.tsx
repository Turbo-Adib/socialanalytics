export default function TailwindTest() {
  return (
    <div className="p-4 bg-red-500 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-2">Tailwind CSS Test</h1>
      <p className="text-sm">If you can see this styled component with red background, white text, and rounded corners, Tailwind CSS is working!</p>
      <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
        Test Button
      </button>
    </div>
  );
}