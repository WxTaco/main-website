import { Link } from 'react-router-dom';

const Welcomer = () => {
  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full themed-container">
        <h1 className="themed-title">Welcomer</h1>
        <p className="text-lg text-white mb-6 text-center">
          Make every new member feel special! The Welcomer feature sends a personalized welcome message when someone joins your server, helping them feel at home right away.
        </p>
        <h2 className="themed-subtitle mb-2">How It Works</h2>
        <ul className="list-disc ml-6 mb-6 themed-text">
          <li>Admins configure a welcome message and select a channel.</li>
          <li>When a new member joins, the bot sends the message automatically.</li>
          <li>Supports custom images, embeds, and dynamic user/server info.</li>
        </ul>
        <h2 className="themed-subtitle mb-2">Why Use Welcomer?</h2>
        <ul className="list-disc ml-6 mb-6 themed-text">
          <li>Creates a friendly, inviting atmosphere for newcomers.</li>
          <li>Helps new members find important info and rules quickly.</li>
          <li>Can be customized to match your server's style and branding.</li>
        </ul>
        <div className="text-center mt-8">
          <Link to="/" className="themed-button-lg">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcomer;