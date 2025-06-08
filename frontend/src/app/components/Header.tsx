import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/events" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
          SPACEAI Events
        </Link>
        <Link href="/new" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          + Add Event
        </Link>
      </div>
    </header>
  );
};

export default Header;