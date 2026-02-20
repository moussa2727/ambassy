'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiHome, FiMail, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { FaHome, FaEnvelope, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function NotFound() {
  useEffect(() => {
    // Animation du compteur
    const timer = setTimeout(() => {
      const counter = document.getElementById('counter');
      if (counter) {
        let count = 0;
        const target = 404;
        const increment = target / 50;

        const updateCounter = () => {
          count += increment;
          if (count < target) {
            counter.textContent = Math.floor(count).toString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toString();
          }
        };
        updateCounter();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col">
      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl mx-auto"
        >
          {/* Code d'erreur animé */}
          <motion.div variants={itemVariants} className="mb-8 relative">
            <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
              <span id="counter" className="inline-block">
                0
              </span>
            </div>
            <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-green-100 blur-xl -z-10">
              404
            </div>
          </motion.div>

          {/* Message d'erreur */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
          >
            Page non trouvée
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto"
          >
            La page que vous recherchez semble avoir disparu. Peut-être qu'elle
            a été déplacée, supprimée ou n'a jamais existé.
          </motion.p>

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiHome className="w-5 h-5" />
              Retour à l'accueil
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow hover:shadow-md"
            >
              <FiArrowLeft className="w-5 h-5" />
              Page précédente
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
