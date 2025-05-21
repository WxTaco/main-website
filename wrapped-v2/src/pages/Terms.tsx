// Terms of Service page

const Terms = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl w-full bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-3xl font-saira mb-2 text-theme-primary">Terms of Service</h1>
        <p className="text-gray-300 mb-8">Last updated: May 21, 2025</p>
        <div className="prose prose-invert max-w-none text-gray-100">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Wrapped V2 ("the Bot"), you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>
          <section className="mt-8">
            <h2>2. Use License</h2>
            <ul className="list-disc ml-6 mt-4">
              <li>The Bot may not be used for any illegal or unauthorized purpose.</li>
              <li>You may not modify, copy, or create derivative works based on the Bot.</li>
              <li>You may not attempt to gain unauthorized access to the Bot’s systems.</li>
            </ul>
          </section>
          <section className="mt-8">
            <h2>3. Responsible Use of Tools</h2>
            <ul className="list-disc ml-6 mt-4">
              <li>Use tools only with permission from the API owner.</li>
              <li>No stress/load/DoS testing without permission.</li>
              <li>No abuse of our tools or third-party services.</li>
            </ul>
            <p className="mt-4">We reserve the right to restrict access if abuse is detected.</p>
          </section>
          <section className="mt-8">
            <h2>4. Disclaimer</h2>
            <p>The Bot is provided “as is” without any warranties.</p>
          </section>
          <section className="mt-8">
            <h2>5. Limitations</h2>
            <p>We are not liable for any damages arising from use of the Bot.</p>
          </section>
          <section className="mt-8">
            <h2>6. Changes to Terms</h2>
            <p>We may update these terms and will reflect changes by updating the “Last updated” date.</p>
          </section>
          <section className="mt-8">
            <h2>7. Contact</h2>
            <p>
              Questions? Contact us via our{" "}
              <a
                href="https://wrappedbot.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-primary hover:underline"
              >
                Support Server
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;