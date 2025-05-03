import { Link } from 'react-router-dom';

const Partnerships = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c94baf] via-fuchsia-400 to-purple-700 flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-4xl w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg p-8 border border-white/30">
        <h1 className="text-4xl font-saira font-extrabold text-wrapped-pink mb-4 text-center drop-shadow">Our Partnerships</h1>
        <p className="text-lg text-white mb-8 text-center">
          We're proud to collaborate with talented developers and studios who share our vision of creating exceptional Discord experiences.
        </p>

        {/* InvoMagic Partnership */}
        <div className="bg-black p-6 rounded-lg border border-invomagic-blue/50 mb-8 backdrop-blur-sm shadow-lg">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-invomagic-blue mb-4 md:mb-0 md:mr-6 flex-shrink-0 shadow-md">
              <img
                src="https://partnership.cdn.wrappedbot.com/Invomagic_2.png"
                alt="InvoMagic"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-invomagic-blue mb-1">InvoMagic Studios</h2>
              <p className="text-white mb-2 font-medium">Founded by MagicGamer</p>
              <div className="flex space-x-3 mb-3">
                <a
                  href="https://discord.gg/bQWvePAwUy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#5865F2] hover:bg-[#4752c4] text-white px-3 py-1 rounded-md text-sm flex items-center transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
                  </svg>
                  Discord
                </a>
                <a
                  href="https://invomagic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-invomagic-blue hover:bg-invomagic-blue/80 text-white px-3 py-1 rounded-md text-sm flex items-center transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                  </svg>
                  Website
                </a>
              </div>
              <p className="text-gray-300">
                InvoMagic Studios specializes in creating powerful Discord bots focused on security, moderation, and utility.
              </p>
            </div>
          </div>

          <div className="border-t border-invomagic-blue/40 pt-6">
            <h3 className="text-xl font-bold text-invomagic-blue mb-4">Featured Bots by InvoMagic</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CyberShield Bot */}
              <div className="bg-black/90 p-4 rounded-lg border border-invomagic-blue/60 shadow-md">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex items-center justify-center border border-invomagic-blue">
                    <img
                      src="https://partnership.cdn.wrappedbot.com/cybershield.png"
                      alt="CyberShield"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-invomagic-blue">CyberShield</h4>
                </div>
                <p className="text-white text-sm">
                  A comprehensive security bot that protects your server from raids, spam, and malicious content.
                </p>
                <div className="mt-3 text-xs text-white">
                  <span className="block">• Anti-raid protection</span>
                  <span className="block">• Spam detection</span>
                  <span className="block">• Join gate</span>
                </div>
              </div>

              {/* Tickets Bot */}
              <div className="bg-black/90 p-4 rounded-lg border border-invomagic-blue/60 shadow-md">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex items-center justify-center border border-invomagic-blue">
                    <img
                      src="https://partnership.cdn.wrappedbot.com/tickets.png"
                      alt="Tickets"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-invomagic-blue">Tickets</h4>
                </div>
                <p className="text-white text-sm">
                  A feature-rich ticket system for managing support requests and user inquiries efficiently.
                </p>
                <div className="mt-3 text-xs text-white">
                  <span className="block">• Custom ticket categories</span>
                  <span className="block">• Transcript generation</span>
                  <span className="block">• Server management</span>
                </div>
              </div>

              {/* Restorio Bot */}
              <div className="bg-black/90 p-4 rounded-lg border border-invomagic-blue/60 shadow-md">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex items-center justify-center border border-invomagic-blue">
                    <img
                      src="https://partnership.cdn.wrappedbot.com/restorio.png"
                      alt="Restorio"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-invomagic-blue">Restorio</h4>
                </div>
                <p className="text-white text-sm">
                  Emergency server recovery bot that helps restore access to your server if you lose permissions.
                </p>
                <div className="mt-3 text-xs text-white">
                  <span className="block">• Server access recovery</span>
                  <span className="block">• Permission restoration</span>
                  <span className="block">• Emergency access</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-invomagic-blue/40 pt-6 mt-6">
            <h3 className="text-xl font-bold text-invomagic-blue mb-4">Our Collaboration</h3>
            <p className="text-gray-300 mb-4">
              Wrapped has partnered with InvoMagic Studios to provide enhanced security and support features for our users.
              We utilize CyberShield for advanced server protection and the Tickets system for streamlined user support.
            </p>
            <p className="text-gray-300">
              This partnership allows us to offer a more comprehensive Discord experience while focusing on our core features.
              Together, we're committed to creating safer, more efficient Discord communities.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-300 mb-6">
            Interested in partnering with Wrapped? We're always looking for innovative collaborations that enhance the Discord experience.
          </p>

          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-wrapped-pink font-bold py-2 px-4 rounded-md border border-wrapped-pink/50 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <a
              href="https://wrappedbot.com/support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-wrapped-pink hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-md transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
              </svg>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnerships;
