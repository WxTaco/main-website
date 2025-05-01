const team = [
  {
    role: 'Project Owner',
    name: 'Your Name Here',
    bio: 'A short description or bio for the project owner goes here.'
  },
  {
    role: 'Web Developer',
    name: 'Your Name Here',
    bio: 'A short description or bio for the web developer goes here.'
  },
  {
    role: 'Bot Developer',
    name: 'Your Name Here',
    bio: 'A short description or bio for the bot developer goes here.'
  },
  {
    role: 'Artist',
    name: 'Your Name Here',
    bio: 'A short description or bio for the first artist goes here.'
  },
  {
    role: 'Artist',
    name: 'Your Name Here',
    bio: 'A short description or bio for the second artist goes here.'
  },
];

const About = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-6 text-center drop-shadow">About Us</h1>
        <p className="text-lg text-white mb-8 text-center">
          Wrapped V2 is a passion project dedicated to providing a free, feature-rich, and user-friendly Discord bot for everyone. Our team is committed to transparency, creativity, and putting the community first.
        </p>
        <div className="space-y-8">
          {team.map((member, idx) => (
            <div key={idx} className="bg-gray-900/80 rounded-lg p-6 shadow border border-white/20">
              <h2 className="text-2xl font-bold text-wrapped-pink mb-2">{member.role}</h2>
              <h3 className="text-xl text-white mb-1">{member.name}</h3>
              <p className="text-pink-200">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About; 