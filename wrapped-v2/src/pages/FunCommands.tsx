import { Link } from 'react-router-dom';

const funCommand = {
  name: '/fun',
  description: 'Fun commands to lighten the mood!',
  subcommands: [
    {
      name: 'joke',
      description: 'Get a random joke.',
      options: [
        { 
          name: 'category', 
          description: 'Joke category', 
          required: false,
          choices: ['Programming', 'Miscellaneous', 'Dark', 'Pun', 'Spooky', 'Christmas']
        }
      ],
      details: 'Fetches a random joke from the JokeAPI. You can specify a category or get a random joke from any category. Jokes can be either single-line or setup/delivery format.'
    },
    {
      name: 'meme',
      description: 'Get a random meme.',
      options: [
        { 
          name: 'subreddit', 
          description: 'Subreddit to fetch from (default: memes)', 
          required: false 
        }
      ],
      details: 'Fetches a random meme image from Reddit. You can specify a subreddit or use the default r/memes. Includes post title, upvotes, and comment count.'
    },
    {
      name: '8ball',
      description: 'Ask the magic 8-ball a question.',
      options: [
        { 
          name: 'question', 
          description: 'Your question for the magic 8-ball', 
          required: true 
        }
      ],
      details: 'The classic Magic 8-Ball experience! Ask any yes/no question and receive one of 20 possible answers, ranging from positive to negative to uncertain.'
    }
  ]
};

const FunCommands = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-2xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Fun Commands</h1>
        <p className="text-lg text-white mb-6 text-center">
          Lighten the mood in your server with jokes, memes, and more fun interactive commands!
        </p>
        
        <div className="bg-gray-900/50 p-5 rounded-lg border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-wrapped-pink mb-3">{funCommand.name}</h2>
          <p className="text-pink-200 mb-4">{funCommand.description}</p>
          
          <h3 className="text-xl font-semibold text-white mb-3">Subcommands</h3>
          <div className="space-y-6">
            {funCommand.subcommands.map((sub) => (
              <div key={sub.name} id={`fun-${sub.name}`} className="border-l-2 border-wrapped-pink pl-4">
                <h4 className="text-lg font-semibold text-wrapped-pink mb-2">/fun {sub.name}</h4>
                <p className="text-pink-200 mb-3">{sub.description}</p>
                
                {sub.options && sub.options.length > 0 && (
                  <>
                    <h5 className="text-white font-medium mb-2">Options:</h5>
                    <ul className="list-disc ml-6 mb-3 text-pink-200">
                      {sub.options.map((opt) => (
                        <li key={opt.name}>
                          <span className="font-semibold">{opt.name}</span> — {opt.description}
                          {opt.required && <span className="text-wrapped-yellow"> (Required)</span>}
                          {opt.choices && (
                            <span className="text-wrapped-blue"> (Choices: {opt.choices.join(', ')})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                
                {sub.details && (
                  <div className="bg-black/20 p-3 rounded mt-2">
                    <p className="text-pink-200 text-sm">{sub.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900/50 p-4 rounded-lg border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-wrapped-pink mb-2">Example Usage</h3>
          <div className="space-y-2 text-pink-200">
            <p><code className="bg-black/30 px-2 py-1 rounded">/fun joke category:Programming</code> — Get a programming-related joke</p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/fun meme subreddit:dankmemes</code> — Get a random meme from r/dankmemes</p>
            <p><code className="bg-black/30 px-2 py-1 rounded">/fun 8ball question:Will I win the lottery?</code> — Ask the magic 8-ball a question</p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-2 px-4 rounded-md border border-wrapped-pink/50 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FunCommands;
