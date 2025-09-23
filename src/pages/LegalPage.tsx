import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LegalPage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center"
          >
            Legal Information
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            className="space-y-12"
          >
            {/* Privacy Policy */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  At Aura Elysian, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Information We Collect</h3>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                  <li>Personal information you provide (name, email, address)</li>
                  <li>Payment information for purchases</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How We Use Your Information</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the collected information to process orders, provide customer support, improve our services, and send marketing communications with your consent.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
            </section>

            {/* Terms of Service */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Terms of Service
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  By accessing and using Aura Elysian's website and services, you agree to be bound by these Terms of Service.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Use of Service</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You agree to use our services only for lawful purposes and in accordance with these terms. You must not use our services in any way that could damage, disable, or impair our website.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Information</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content are accurate, complete, or error-free.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Limitation of Liability</h3>
                <p className="text-gray-600 leading-relaxed">
                  Aura Elysian shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our services.
                </p>
              </div>
            </section>

            {/* Return Policy */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Return Policy
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  We want you to be completely satisfied with your Aura Elysian candles. If you're not happy with your purchase, we offer a hassle-free return process.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Eligibility</h3>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                  <li>There is no return policy</li>
                  {/* <li>Products must be in original, unused condition</li> */}
                  {/* <li>Original packaging and labels must be intact</li> */}
                  <li>Custom orders and personalized items are non-returnable</li>
                </ul>
                {/* <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Process</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  To initiate a return, please contact our customer service team with your order number and reason for return. We'll provide you with a return authorization if possible.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Return Shipping</h3>
                <p className="text-gray-600 leading-relaxed">
                  Customers are responsible for return shipping costs unless the return is due to our error or a defective product. We recommend using a trackable shipping method for your protection.
                </p> */}
              </div>
            </section>

            {/* Refund Process */}
            <section>
              {/* <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Refund Process
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Once we receive your returned item, we will inspect it and process your refund according to the following guidelines.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Timeline</h3>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                  <li>Processing time: 3-5 business days after receiving returned item</li>
                  <li>Refund method: Original payment method</li>
                  <li>Bank processing: 5-10 business days for credit card refunds</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Amount</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Refunds will be issued for the full purchase price of the returned items, excluding original shipping costs. If the return is due to our error, we will also refund the original shipping charges.
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Non-Refundable Items</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Custom or personalized candles</li>
                  <li>Items damaged by customer misuse</li>
                  <li>Items returned after 30 days</li>
                  <li>Used or damaged products</li>
                </ul>
              </div> */}
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  If you have any questions about this Legal Information, please contact us:
                </p>
                <ul className="list-none text-gray-600">
                  <li>Email: info@auraelysian.com</li>
                  <li>Phone: +91 9934202241</li>
                  <li>Address: Om vihar phase 1, Uttam nagar west, New Delhi</li>
                </ul>
              </div>
            </section>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
