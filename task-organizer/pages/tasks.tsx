import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <h1 className="text-2xl font-bold">Home</h1>
        {/* Your home content here */}
      </main>
    </div>
  );
}