import React from "react";
import { motion } from "framer-motion";
import logo from "../../assets/img/logo.png"; // Adjust the logo path as needed

const GetStarted = ({ isDarkMode }) => {
  return (
    <section className="bg-white dark:bg-[#121212] text-black dark:text-white py-16 border-b border-gray-200 dark:border-gray-700">
      <motion.div
        className="max-w-md mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-28 h-28" // Adjust the logo size if needed
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Get Started Now
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Start your website monitoring in less than 30 sec.
        </motion.p>

        {/* Get Started Button */}
        <motion.button
          className="bg-[#35976b] hover:bg-[#2e865f] text-white font-semibold py-3 px-8 rounded-full dark:bg-[#287150] dark:hover:bg-[#205c44]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </section>
  );
};

export default GetStarted;
