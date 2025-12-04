import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, MessageCircle, Phone, Send } from 'lucide-react';

const SupportModal = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const supportEmail = '2410030140@klh.edu.in';

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('Support Request from KisanAI');
    const body = encodeURIComponent(message || 'I need help with KisanAI platform.');
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Support & Help</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              <p className="font-semibold text-gray-900">Email Support</p>
            </div>
            <a
              href={`mailto:${supportEmail}`}
              className="text-sm text-emerald-600 hover:underline break-all"
            >
              {supportEmail}
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none"
                placeholder="Describe your issue or question..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              Send Email
            </button>
          </form>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SupportModal;

