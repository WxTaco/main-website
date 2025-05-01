import LegalPage from '../components/LegalPage';

const Terms = () => {
  return (
    <LegalPage title="Terms of Service" lastUpdated="May 1, 2024">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Wrapped V2 ("the Bot"), you agree to be bound by these Terms of Service
          and all applicable laws and regulations. If you do not agree with any of these terms, you are
          prohibited from using or accessing the Bot.
        </p>
      </section>

      <section className="mt-8">
        <h2>2. Use License</h2>
        <p>
          Permission is granted to use the Bot within Discord servers where it has been invited,
          subject to the following conditions:
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>The Bot may not be used for any illegal or unauthorized purpose.</li>
          <li>You may not modify, copy, or create derivative works based on the Bot.</li>
          <li>You may not attempt to gain unauthorized access to the Bot's systems or networks.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2>3. Disclaimer</h2>
        <p>
          The Bot is provided "as is" without any warranties, expressed or implied. We do not warrant
          that the Bot will be uninterrupted or error-free.
        </p>
      </section>

      <section className="mt-8">
        <h2>4. Limitations</h2>
        <p>
          In no event shall Wrapped V2 or its developers be liable for any damages arising out of the
          use or inability to use the Bot.
        </p>
      </section>

      <section className="mt-8">
        <h2>5. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify users of any changes
          by updating the "Last updated" date of these Terms of Service.
        </p>
      </section>

      <section className="mt-8">
        <h2>6. Contact Information</h2>
        <p>
          For any questions regarding these Terms of Service, please contact us through our{' '}
          <a
            href="https://wrappedbot.com/support"
            className="text-wrapped-pink hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support Server
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
};

export default Terms; 