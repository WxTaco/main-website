import { Link } from 'react-router-dom';

const Tickets = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Tickets System</h1>
        <p className="text-lg text-white mb-6 text-center">
          Manage support and user requests with our advanced ticket system! Create, track, and resolve tickets with ease. Each ticket can be exported as an HTML transcript for easy record-keeping and sharing.
        </p>
        <h2 className="text-2xl font-bold text-wrapped-pink mb-2">Features</h2>
        <ul className="list-disc ml-6 mb-6 text-pink-200">
          <li>Fully customizable ticket categories and workflows.</li>
          <li>HTML transcripts for every ticket, downloadable and shareable.</li>
          <li>Easy-to-use commands for opening, closing, and managing tickets.</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="text-wrapped-pink font-bold hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Tickets; 