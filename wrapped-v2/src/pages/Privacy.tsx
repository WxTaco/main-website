// Privacy Policy page

const Privacy = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl w-full bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-3xl font-saira mb-2 text-theme-primary">Privacy Policy</h1>
        <p className="text-gray-300 mb-8">Last updated: December 19, 2024</p>
        <div className="prose prose-invert max-w-none text-gray-100">
          <section>
            <h2>1. Information We Collect</h2>
            <p>When you use Wrapped v2 and our services, we may collect the following information:</p>
            <ul className="list-disc ml-6 mt-4">
              <li><strong>Discord Data:</strong> User IDs, server IDs, channel IDs, message content (for command processing only)</li>
              <li><strong>Usage Statistics:</strong> Command usage, message statistics, server activity metrics</li>
              <li><strong>Technical Data:</strong> IP addresses, browser information, device information</li>
              <li><strong>User-Generated Content:</strong> Custom embeds, configurations, and settings you create</li>
              <li><strong>Website Analytics:</strong> Page views, session duration, and interaction data</li>
            </ul>
          </section>
          <section className="mt-8">
            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Providing and maintaining Wrapped v2's functionality</li>
              <li>Processing commands and delivering bot services</li>
              <li>Improving our services and developing new features</li>
              <li>Analyzing usage patterns and performance metrics</li>
              <li>Providing customer support and technical assistance</li>
              <li>Ensuring security and preventing abuse</li>
            </ul>
            <p className="mt-4">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>
          <section className="mt-8">
            <h2>3. Data Security and Storage</h2>
            <p>We implement appropriate security measures to protect your information:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>All data is encrypted in transit using industry-standard protocols</li>
              <li>Database backups are encrypted and stored securely</li>
              <li>Access to user data is restricted to authorized personnel only</li>
              <li>Regular security audits and monitoring are performed</li>
              <li>We follow Discord's API guidelines and security best practices</li>
            </ul>
            <p className="mt-4 font-semibold text-yellow-400">Security Disclaimer:</p>
            <p>
              While we implement robust security measures, any statements regarding the security or reliability of our systems are not legally binding and cannot be used as grounds for claims. We cannot guarantee absolute security of data transmission over the internet.
            </p>
          </section>
          <section className="mt-8">
            <h2>4. Third-Party Services and OAuth</h2>
            <p>Our services integrate with various third-party platforms:</p>
            <ul className="list-disc ml-6 mt-4">
              <li><strong>Discord OAuth:</strong> Used only for identity verification and permissions. Login credentials are never stored.</li>
              <li><strong>Google APIs:</strong> For AI features like Gemini text generation</li>
              <li><strong>External APIs:</strong> Various APIs for tool functionality (with user permission)</li>
              <li><strong>Analytics Services:</strong> For website performance and usage analytics</li>
            </ul>
            <p className="mt-4">These third-party services have their own privacy policies and terms of service.</p>
          </section>
          <section className="mt-8">
            <h2>5. Cookies and Local Storage</h2>
            <p>We use cookies and local storage for:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Session management and authentication</li>
              <li>User preferences and settings</li>
              <li>Website functionality and performance</li>
              <li>Analytics and usage tracking (anonymized)</li>
            </ul>
            <p className="mt-4">You can control cookie settings through your browser preferences.</p>
          </section>
          <section className="mt-8">
            <h2>6. Data Retention and Deletion</h2>
            <p>We retain your information only as long as necessary to provide our services:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Active user data is retained while you use our services</li>
              <li>Inactive accounts may have data purged after extended periods of inactivity</li>
              <li>Some data may be retained for legal compliance or security purposes</li>
              <li>Backups may contain data for up to 90 days after deletion</li>
            </ul>
            <p className="mt-4">
              To request data deletion, join our{" "}
              <a
                href="https://wrappedbot.com/support"
                className="text-theme-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Support Server
              </a>{" "}
              and open a ticket. We will verify your Discord account and process your request within 30 days.
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
          <section className="mt-8">
            <h2>9. International Data Transfers</h2>
            <p>
              Your data may be processed and stored in countries other than your own. We ensure appropriate safeguards are in place for international data transfers in compliance with applicable privacy laws.
            </p>
          </section>
          <section className="mt-8">
            <h2>10. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
