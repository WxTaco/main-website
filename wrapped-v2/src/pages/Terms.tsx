// Terms of Service page
import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl w-full bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-3xl font-saira mb-2 text-theme-primary">Terms of Service</h1>
        <p className="text-gray-300 mb-8">Last updated: December 19, 2024</p>
        <div className="prose prose-invert max-w-none text-gray-100">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Wrapped v2 ("the Bot"), our website, web tools, or any related services ("the Services"), you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>
          <section className="mt-8">
            <h2>2. Services Provided</h2>
            <p>Our services include but are not limited to:</p>
            <ul className="list-disc ml-6 mt-4">
              <li>Wrapped v2 Discord bot with moderation, utility, and entertainment features</li>
              <li>Web-based development tools (JSON debugger, CSS generator, color palette generator, etc.)</li>
              <li>Discord embed builder and other Discord-related utilities</li>
              <li>API testing and development tools</li>
              <li>Documentation and support resources</li>
            </ul>
          </section>
          <section className="mt-8">
            <h2>3. Use License and Restrictions</h2>
            <ul className="list-disc ml-6 mt-4">
              <li>The Services may not be used for any illegal or unauthorized purpose.</li>
              <li>You may not modify, copy, distribute, or create derivative works based on the Services.</li>
              <li>You may not attempt to gain unauthorized access to our systems or networks.</li>
              <li>You may not use the Services to harm, harass, or violate the rights of others.</li>
              <li>You may not use automated systems to access the Services without permission.</li>
            </ul>
          </section>
          <section className="mt-8">
            <h2>4. Responsible Use of Tools</h2>
            <ul className="list-disc ml-6 mt-4">
              <li>Use API testing tools only with permission from the API owner.</li>
              <li>No stress testing, load testing, or DoS testing without explicit permission.</li>
              <li>No abuse of our tools or third-party services integrated within our platform.</li>
              <li>Respect rate limits and usage guidelines for all tools and services.</li>
              <li>Do not use our tools to violate Discord's Terms of Service or Community Guidelines.</li>
            </ul>
            <p className="mt-4">We reserve the right to restrict or terminate access if abuse is detected.</p>
          </section>
          <section className="mt-8">
            <h2>5. Quality and Performance Disclaimer</h2>
            <p className="font-semibold text-yellow-400 mb-4">Important Notice:</p>
            <p>
              Any statements regarding the usability, security, reliability, or quality of our projects or subsidiaries are not legally binding and cannot be used as grounds for any claims of false advertising or other legal actions. All performance claims, uptime guarantees, security assurances, and quality statements are provided for informational purposes only.
            </p>
          </section>
          <section className="mt-8">
            <h2>6. Disclaimer of Warranties</h2>
            <p>
              The Services are provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Services will be uninterrupted, error-free, or completely secure.
            </p>
          </section>
          <section className="mt-8">
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from your use of the Services, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount you paid for the Services in the 12 months preceding the claim.
            </p>
          </section>
          <section className="mt-8">
            <h2>8. User Content and Data</h2>
            <p>
              You retain ownership of any content you submit through our Services. By using our Services, you grant us a limited license to process, store, and display your content as necessary to provide the Services. You are responsible for ensuring you have the right to submit any content.
            </p>
          </section>
          <section className="mt-8">
            <h2>9. Third-Party Services</h2>
            <p>
              Our Services may integrate with or provide access to third-party services (such as Discord, Google APIs, etc.). Your use of these third-party services is subject to their respective terms of service and privacy policies. We are not responsible for the availability, content, or practices of third-party services.
            </p>
          </section>
          <section className="mt-8">
            <h2>10. Termination</h2>
            <p>
              We may terminate or suspend your access to the Services at any time, with or without cause or notice. Upon termination, your right to use the Services will cease immediately. Sections of these Terms that by their nature should survive termination will survive.
            </p>
          </section>
          <section className="mt-8">
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by updating the "Last updated" date and, where appropriate, through other communication channels. Continued use of the Services after changes constitutes acceptance of the new Terms.
            </p>
          </section>
          <section className="mt-8">
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms or your use of the Services shall be resolved through binding arbitration or in courts of competent jurisdiction.
            </p>
          </section>
          <section className="mt-8">
            <h2>13. Contact Information</h2>
            <p>
              Questions about these Terms? Contact us via our{" "}
              <a
                href="https://wrappedbot.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-primary hover:underline"
              >
                Support Server
              </a>{" "}
              or through the contact methods available on our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
