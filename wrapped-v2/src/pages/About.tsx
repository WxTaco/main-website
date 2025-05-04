import { useState, useRef } from 'react';

// Add keyframe animations for message fade-in and fade-out
const animations = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOutDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}
`;

// Add the animation to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = animations;
  document.head.appendChild(style);
}

const team = [
  {
    id: 'owner',
    role: 'Project Owner & Lead Developer',
    name: 'Taco',
    tag: '#0001',
    avatar: 'https://cdn.wrappedbot.com/Taco_pfp_2.png',
    banner: 'https://cdn.wrappedbot.com/Taco_Develope_1.png',
    bannerColor: '#5865F2',
    bio: 'Founder and lead developer of Wrapped V2. Creating the best Discord bot experience possible!',
    status: 'online',
    statusMessage: 'Working on Wrapped V2',
    messages: [
      {
        content: 'Hello! I am the lead developer and project owner for Wrapped. I spend a lot of my time working on this site and the bot itself and have thoroughly enjoyed the challenges it has presented me with. The original version of this project, Wrapped V1, was shut down due to circumstances outside of my control, and it was during that downtime that I decided I was gonna expand the capabilities of Wrapped. Since then, we\'ve taken Wrapped from it\'s original purpose, a high quality statistics bot, and turned it into an all purpose Discord bot, and we are excited to share V2 with you.',
        timestamp: new Date().toISOString(),
        reactions: [
          { emoji: '❤️', count: 42 },
          { emoji: '👍', count: 24 },
          { emoji: '🚀', count: 18 }
        ]
      }
    ]
  },
  {
    id: 'community',
    role: 'Support Server Manager & Developer',
    name: 'MagicGamer',
    tag: '#0001',
    avatar: 'https://cdn.wrappedbot.com/M.png',
    banner: 'https://cdn.wrappedbot.com/MagicGamer_2.png',
    bannerColor: '#FEE75C',
    bio: 'Developer & Designer for Wrapped who manages the support server and helps users with any questions.',
    status: 'online',
    statusMessage: 'Helping users!',
    messages: [
      {
        content: 'Heya, I\'m MagicGamer, I\'m A Developer & Designer For Wrapped And I Do Most Of The Support Server Management :]',
        timestamp: new Date().toISOString(),
        reactions: [
          { emoji: '👋', count: 18 },
          { emoji: '💻', count: 12 }
        ]
      },
      {
        content: 'It\'s Been Quite A Fun Project To Work On! Especially The Design Aspects ^^',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        reactions: [
          { emoji: '🎨', count: 15 },
          { emoji: '✨', count: 21 }
        ]
      },
      {
        content: 'In My Free time I Typically Work On Bots Such As Tickets, Linkr, CyberShield, Etc. Also, Cats Are Best Animal On This Planet, That Is Objective And Indisputable',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        reactions: [
          { emoji: '🐱', count: 42 },
          { emoji: '💯', count: 16 }
        ]
      },
      {
        content: 'Join our support server for help, updates, and to connect with other Wrapped V2 users: https://discord.gg/M5uYGRudBv',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        reactions: [
          { emoji: '🤝', count: 24 }
        ]
      }
    ]
  },

  {
    id: 'artist',
    role: 'Original Artist',
    name: 'Switchy',
    tag: '#1234',
    avatar: 'https://cdn.wrappedbot.com/switchy.png',
    banner: 'https://cdn.wrappedbot.com/7c7c9194baef111a613157c8b9473278.png',
    bannerColor: '#ED4245',
    bio: 'Original artist for Wrapped V1 and continuing to create art for Wrapped V2.',
    status: 'online',
    statusMessage: 'Creating art',
    messages: [
      {
        content: 'Welcome! I\'m Switchy, The Original Artist For Wrapped V1, And I\'m Excited To Be Working On Wrapped V2! I Have A Lot Of Fun With The Developers, And They Are Such Kind People. When I\'m Not Doing Wrapped Things, I Mostly Work On My Solo Projects, Like Creating Art And Running My Own Communities On Discord. We\'ve Got A Lot Of Cool Stuff In The Making With Wrapped So Stay Tuned! For More Information Or Insights, Visit Our Support Server. Thank You For Following The Development Of Wrapped.',
        timestamp: new Date().toISOString(),
        reactions: [
          { emoji: '🎨', count: 27 },
          { emoji: '✨', count: 19 },
          { emoji: '❤️', count: 32 }
        ]
      }
    ]
  }
];

// Status indicator component
const StatusIndicator = ({ status }: { status: string }) => {
  const statusColors: Record<string, string> = {
    online: 'bg-green-500',
    idle: 'bg-yellow-500',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500'
  };

  // Default to online if status is not recognized
  const statusColor = statusColors[status] || statusColors.online;

  return (
    <div className={`w-6 h-6 rounded-full ${statusColor} absolute bottom-1 right-1 border-2 border-gray-800`}></div>
  );
};

// Define types for our components
interface MessageReaction {
  emoji: string;
  count: number;
}

interface MessageProps {
  message: {
    content: string;
    timestamp: string;
    reactions?: MessageReaction[];
  };
  avatar: string;
  username: string;
}

// Discord message component
const DiscordMessage = ({ message, avatar, username }: MessageProps) => {
  // State to track user reactions and animations
  const [reactions, setReactions] = useState<MessageReaction[]>(message.reactions || []);
  const [recentlyClicked, setRecentlyClicked] = useState<number | null>(null);
  const [userReactions, setUserReactions] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle reaction click
  const handleReactionClick = (idx: number) => {
    // Check if user already reacted to this reaction
    if (userReactions.includes(idx)) {
      // User already reacted, so unreact
      setReactions(prevReactions => {
        const newReactions = [...prevReactions];
        // Decrease count
        newReactions[idx] = {
          ...newReactions[idx],
          count: Math.max(0, newReactions[idx].count - 1)
        };

        // Keep track of the original indices before filtering
        const originalIndices = newReactions.map((_, i) => i);

        // Filter out reactions with zero count
        const filteredReactions = newReactions.filter(reaction => {
          return reaction && reaction.count > 0;
        });

        // Create a mapping from old indices to new indices
        const indexMapping: Record<number, number> = {};
        let newIndex = 0;

        originalIndices.forEach(oldIndex => {
          if (newReactions[oldIndex] && newReactions[oldIndex].count > 0) {
            indexMapping[oldIndex] = newIndex++;
          } else {
            indexMapping[oldIndex] = -1; // Removed reaction
          }
        });

        // Update user reactions with the new indices
        setTimeout(() => {
          setUserReactions(prev => {
            return prev.filter(i => i !== idx) // Remove the current reaction
              .map(i => indexMapping[i] !== undefined ? indexMapping[i] : i) // Map to new indices
              .filter(i => i !== -1); // Remove any that were mapped to -1 (removed reactions)
          });
        }, 0);

        return filteredReactions;
      });

      return;
    }

    setReactions(prevReactions => {
      const newReactions = [...prevReactions];
      newReactions[idx] = {
        ...newReactions[idx],
        count: newReactions[idx].count + 1
      };
      return newReactions;
    });

    // Add to user reactions
    setUserReactions(prev => [...prev, idx]);

    // Set recently clicked for animation
    setRecentlyClicked(idx);

    // Clear previous timeout if exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear the animation after 1 second
    timeoutRef.current = setTimeout(() => {
      setRecentlyClicked(null);
    }, 1000);
  };

  return (
    <div className="bg-gray-700 rounded-md p-2 sm:p-3 mb-2 hover:bg-gray-650 transition-colors">
      <div className="flex items-start">
        <img src={avatar} alt={username} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center mb-1 gap-1 sm:gap-0">
            <span className="font-medium text-white text-sm sm:text-base">{username}</span>
            <span className="text-gray-400 text-xs sm:ml-2 w-full sm:w-auto">
              {new Date(message.timestamp).toLocaleString(undefined, {
                year: '2-digit',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base break-words">
            {message.content}
          </div>
          <div className="flex flex-wrap mt-2 gap-1 sm:gap-2">
            {reactions && reactions.length > 0 && reactions.map((reaction, idx) => (
              <button
                key={idx}
                onClick={() => handleReactionClick(idx)}
                className={`${
                  userReactions.includes(idx)
                    ? 'bg-gray-700 border border-theme-primary'
                    : 'bg-gray-800 hover:bg-gray-700'
                } rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center text-xs sm:text-sm transition-all ${
                  recentlyClicked === idx ? 'transform scale-110 sm:scale-125' : ''
                }`}
                title={userReactions.includes(idx) ? "Click to remove your reaction" : "Click to add reaction"}
              >
                <span className={recentlyClicked === idx ? 'animate-bounce' : ''}>{reaction.emoji}</span>
                <span className="ml-1 text-gray-300">{reaction.count}</span>
              </button>
            ))}
            <button
              onClick={() => {
                const emojis = ['👍', '❤️', '🎉', '🔥', '👀', '🚀', '✨', '🙌'];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                const newReactionIndex = reactions.length;
                setReactions(prev => [...prev, { emoji: randomEmoji, count: 1 }]);
                setUserReactions(prev => [...prev, newReactionIndex]);
                setRecentlyClicked(newReactionIndex);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => setRecentlyClicked(null), 1000);
              }}
              className="bg-gray-800 hover:bg-gray-700 rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 flex items-center text-xs sm:text-sm transition-all"
              title="Add random reaction"
            >
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const About = () => {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState<string | null>(null);

  const toggleMember = (id: string) => {
    if (!isAnimating) {
      setIsAnimating(true);

      if (expandedMember === id) {
        // Set closing state to trigger fade-out animation
        setIsClosing(id);

        // Closing messages - keep the expanded state during animation
        // This allows the CSS transition to play out before removing the content
        setTimeout(() => {
          setExpandedMember(null);
          setIsClosing(null);
          setIsAnimating(false);
        }, 700); // Match this with the CSS transition duration
      } else {
        // Clear any closing state
        setIsClosing(null);

        // Opening messages
        setExpandedMember(id);
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }
    }
  };

  return (
    <div className="min-h-screen w-full themed-gradient-bg flex flex-col items-center justify-start py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-3xl w-full themed-container">
        <h1 className="themed-title mb-4 sm:mb-6 text-2xl sm:text-3xl">About Us</h1>
        <p className="text-base sm:text-lg text-white mb-6 sm:mb-8 text-center">
          Wrapped V2 is a passion project dedicated to providing a free, feature-rich, and user-friendly Discord bot for everyone. Our team is committed to transparency, creativity, and putting the community first.
        </p>

        <div className="space-y-8">
          {team.map((member) => (
            <div key={member.id} className="bg-gray-900/90 rounded-lg shadow border border-white/20 overflow-hidden">
              {/* Banner */}
              <div
                className="h-40 sm:h-64 w-full relative"
                style={{
                  backgroundColor: member.bannerColor,
                  backgroundImage: member.banner ? `url(${member.banner})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>

              {/* Profile section */}
              <div className="px-4 sm:px-6 pt-16 sm:pt-20 pb-6 relative">
                {/* Avatar */}
                <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-gray-900"
                    />
                    <StatusIndicator status={member.status} />
                  </div>
                </div>

                {/* User info */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                  <div>
                    <div className="flex items-center flex-wrap">
                      <h2 className="text-xl font-bold text-white">{member.name}</h2>
                      <span className="text-gray-400 ml-1">{member.tag}</span>
                    </div>
                    <h3 className="text-theme-primary font-semibold">{member.role}</h3>
                    {member.statusMessage && (
                      <div className="text-gray-300 text-sm mt-1">
                        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{
                          backgroundColor: member.status === 'online' ? '#57F287' :
                                          member.status === 'idle' ? '#FEE75C' :
                                          member.status === 'dnd' ? '#ED4245' : '#747F8D'
                        }}></span>
                        {member.statusMessage}
                      </div>
                    )}
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => toggleMember(member.id)}
                    className={`text-white rounded-md px-3 py-1 text-sm transition-all duration-300 w-full sm:w-auto ${
                      isAnimating ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      isClosing === member.id
                        ? 'bg-gray-600 hover:bg-gray-500' // Closing state
                        : expandedMember === member.id
                          ? 'bg-gray-600 hover:bg-gray-500' // Open state
                          : 'bg-gray-700 hover:bg-gray-600' // Closed state
                    }`}
                    disabled={isAnimating}
                  >
                    <div className="flex items-center justify-center sm:justify-start">
                      {expandedMember === member.id || isClosing === member.id ? (
                        <>
                          <span>Hide Messages</span>
                          <svg xmlns="http://www.w3.org/2000/svg"
                               className={`h-4 w-4 ml-1 transition-transform duration-700 transform ${
                                 isClosing === member.id ? 'rotate-0' : 'rotate-180'
                               }`}
                               fill="none"
                               viewBox="0 0 24 24"
                               stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>View Messages</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Bio */}
                <div className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base">
                  {member.bio}
                </div>

                {/* Messages */}
                <div className={`mt-4 sm:mt-6 border-t border-gray-700 pt-3 sm:pt-4 overflow-hidden transition-all duration-700 ease-in-out ${
                  expandedMember === member.id
                    ? 'max-h-[5000px] opacity-100 transform translate-y-0'
                    : isClosing === member.id
                      ? 'max-h-[5000px] opacity-0 transform -translate-y-4 border-t-transparent' // Closing state
                      : 'max-h-0 opacity-0 transform -translate-y-4 border-t-transparent' // Closed state
                }`}>
                  {(expandedMember === member.id || isClosing === member.id) && (
                    <>
                      <h4 className="text-white font-medium mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Messages
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        {member.messages.map((message, idx) => {
                          return (
                            <div
                              key={idx}
                              className={`transition-all duration-500 ease-in-out ${
                                isClosing === member.id ? 'opacity-0 transform translate-y-4' : 'opacity-0 transform translate-y-4'
                              }`}
                              style={{
                                animation: isClosing === member.id
                                  ? `fadeOutDown 500ms ease-in ${(member.messages.length - idx - 1) * 150}ms forwards`
                                  : `fadeInUp 500ms ease-out ${idx * 300}ms forwards`
                              }}
                            >
                              <DiscordMessage
                                message={message}
                                avatar={member.avatar}
                                username={member.name}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;