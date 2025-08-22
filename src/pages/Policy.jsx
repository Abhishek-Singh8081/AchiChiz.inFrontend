import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto pt-[100px] px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="text-sm text-gray-500 text-center mb-10">
        Effective Date: July 2, 2025
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <p className="mb-2">
          We may collect information such as your name, email, phone number,
          shipping/billing address, and payment details when you shop with us.
        </p>
        <p>
          We also collect browsing data including IP address, browser type,
          device type, and usage patterns through cookies and analytics tools.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To process and ship your orders</li>
          <li>To create and manage your account</li>
          <li>To improve our website and services</li>
          <li>To send updates, offers, and newsletters</li>
          <li>To prevent fraud and ensure security</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Cookies & Tracking</h2>
        <p>
          We use cookies to personalize your experience and analyze website
          traffic. You can disable cookies in your browser settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Sharing Your Data</h2>
        <p>
          We do not sell your data. We may share it with trusted third-party
          services like payment gateways and shipping partners, or if legally required.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
        <p>
          We implement safeguards to protect your data. However, no online
          method is 100% secure. Please protect your account credentials.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
        <p>You can:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access the information we hold about you</li>
          <li>Request updates or deletion of your data</li>
          <li>Opt out of marketing emails</li>
        </ul>
        <p>Contact us at <a className="text-blue-600 underline" href="mailto:support@achichiz.com">support@achichiz.com</a></p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Children’s Privacy</h2>
        <p>
          Our services are not intended for children under 13. We do not knowingly collect their data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">8. Policy Updates</h2>
        <p>
          We may update this Privacy Policy from time to time. All changes will
          be posted here with the updated date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
        <p>
          📧 Email: <a className="text-blue-600 underline" href="mailto:support@achichiz.com">support@achichiz.com</a><br />
          📞 Phone: +91-XXXXXXXXXX<br />
          📍 Address: [Insert your business address here]
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
