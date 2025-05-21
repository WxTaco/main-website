// Privacy Policy page

const Privacy = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl w-full bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-3xl font-saira mb-2 text-theme-primary">Privacy Policy</h1>
        <p className="text-gray-300 mb-8">Last updated: May 21, 2025</p>
        <div className="prose prose-invert max-w-none text-gray-100">
          <section>
            <h2>1. What We Collect</h2>
            <ul className="list-disc ml-6 mt-4">
              <li>Discord User IDs</li>
              <li>Message statistics (sent, deleted, etc.)</li>
              <li>Server and channel IDs</li>
            </ul>
          </section>
          <section className="mt-8">
            <h2>2. How We Use Data</h2>
            <p>Used solely for bot functionality like analytics and leveling. We do not sell or share it.</p>
          </section>
          <section className="mt-8">
            <h2>3. Data Security</h2>
            <p>All data is stored securely and backed up encrypted. Transactions are encrypted in transit.</p>
          </section>
          <section className="mt-8">
            <h2>4. OAuth & Third-Party</h2>
            <p>
              We use Discord OAuth only for identity and permissions. Login credentials are never stored.
            </p>
          </section>
          <section className="mt-8">
            <h2>5. Cookies</h2>
            <p>
              We use cookies for session and preference storage only. No personal or tracking data is stored.
            </p>
          </section>
          <section className="mt-8">
            <h2>6. Data Deletion</h2>
            <p>
              Join our{" "}
              <a
                href="https://wrappedbot.com/support"
                className="text-theme-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Support Server
              </a>{" "}
              and open a ticket to request deletion. We will verify your Discord account and process within 30 days.
            </p>
          </section>
          <section className="mt-8">
            <h2>7. GDPR / CCPA</h2>
            <ul className="list-disc ml-6 mt-4">
              <li>Right to access, correct, or delete your data</li>
              <li>Right to know how it’s used</li>
            </ul>
          </section>
          <section className="mt-8">
            <h2>8. Updates</h2>
            <p>
              We may update this policy. Changes will be reflected in the “Last updated” date above.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
