import React from "react";
// import { ReturnRefundPolicy as PolicyComponent } from "..";

const ReturnRefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Return & Refund Policy</h1>

      {/* Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p>
          At ACHICHIZ, we strive to offer the finest handcrafted products. If you're not completely satisfied with your purchase, you can request a return or refund under the conditions outlined below.
        </p>
      </section>

      {/* Eligibility */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Eligibility for Return</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>The item must be unused and in its original condition and packaging.</li>
          <li>Return request must be raised within <strong>7 days</strong> of delivery.</li>
          <li>Products must be accompanied by proof of purchase (invoice or order ID).</li>
          <li>Items that are customized or made-to-order are not eligible for return.</li>
        </ul>
      </section>

      {/* Return Process */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Return Process</h2>
        <p className="mb-2">To initiate a return, follow these steps:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Log in to your account and go to the "My Orders" section.</li>
          <li>Select the item you wish to return and click on "Request Return".</li>
          <li>Choose the reason and upload necessary photos (if required).</li>
          <li>We will arrange a pickup or share the return shipping address.</li>
        </ol>
        <p className="mt-2">
          <strong>Note:</strong> Return shipping charges may apply unless the product was received damaged or incorrect.
        </p>
      </section>

      {/* Refund Policy */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Refunds</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Once your return is received and inspected, we will notify you via email or SMS.</li>
          <li>Approved refunds will be processed within <strong>5–7 business days</strong>.</li>
          <li>Refunds are credited back to the original payment method or store wallet.</li>
          <li>Partial refunds may be issued in some cases (e.g., damaged item).</li>
        </ul>
      </section>

      {/* Exchange Policy */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Exchanges</h2>
        <p>
          We only replace items if they are defective, damaged, or incorrectly shipped. For exchanges, please contact our support team within 7 days of delivery.
        </p>
      </section>

      {/* Non-returnable Items */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Non-Returnable Items</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Customized or made-to-order items</li>
          <li>Gift cards</li>
          <li>Sale or discounted items</li>
          <li>Items without original packaging</li>
        </ul>
      </section>

      {/* Support Contact */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
        <p>
          For any return, refund, or exchange-related queries, feel free to reach out to our customer support:
        </p>
        <ul className="list-inside mt-2">
          <li>Email: <a href="mailto:support@achichiz.com" className="text-blue-600 underline">support@achichiz.com</a></li>
          <li>Phone: +91-9876543210</li>
        </ul>
      </section>

      <p className="text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} ACHICHIZ. All rights reserved.
      </p>
    </div>
  );
};

export default ReturnRefundPolicy;
