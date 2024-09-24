import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`w-full md:pt-2 lg:pt-16 xl:pt-20 flex items-center justify-center transition-colors duration-300 ${
        isDarkMode ? "bg-[#121212]" : "bg-[#ffffff]"
      } border-b border-gray-200 dark:border-gray-700`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto max-w-full px-4 pt-8 text-center">
        <motion.div
          className="border p-1 w-full sm:w-80 mx-auto rounded-full flex items-center justify-between mb-4"
          style={{
            color: isDarkMode ? "#35976b" : "#287150",
            fontFamily: "Slabo 27px, serif",
            fontWeight: 700,
          }}
          variants={itemVariants}
        >
          <span className="font-inter text-sm font-large text-gray-900 ml-3 dark:text-white">
            Monitor your website’s performance.
          </span>
          <a
            href="#"
            className="w-8 h-8 rounded-full flex justify-center items-center"
            style={{
              backgroundColor: isDarkMode ? "#2e865f" : "#35976b",
            }}
          >
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.83398 8.00019L12.9081 8.00019M9.75991 11.778L13.0925 8.44541C13.3023 8.23553 13.4073 8.13059 13.4073 8.00019C13.4073 7.86979 13.3023 7.76485 13.0925 7.55497L9.75991 4.22241"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
        <motion.h1
          className="max-w-2xl mx-auto font-manrope font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-5 md:text-5xl leading-tight"
          variants={itemVariants}
        >
          Keep your sites online with our
          <span
            className="mt-4 ml-1.5"
            style={{
              color: isDarkMode ? "#35976b" : "#287150",
              fontFamily: "Slabo 27px, serif",
              fontWeight: 700,
            }}
          >
            Uptime Monitor
          </span>
        </motion.h1>
        <motion.p
          className="max-w-sm mx-auto text-base font-medium leading-7 text-gray-500 dark:text-gray-300 mb-9"
          variants={itemVariants}
        >
          Monitor your sites' performance and reliability with instant alerts
          and global visibility. Ensure your services are always online and
          optimized.
        </motion.p>
        <motion.a
          href="#"
          className="w-full md:w-auto mb-14 inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full"
          style={{
            backgroundColor: isDarkMode ? "#35976b" : "#35976b",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s",
          }}
          whileHover={{
            scale: 1.05,
            backgroundColor: isDarkMode ? "#287150" : "#2e865f",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
          <svg
            className="ml-2"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>
        <motion.div className="flex justify-center" variants={itemVariants}>
          <img
            src="https://pagedone.io/asset/uploads/1691054543.png"
            alt="Uptime Monitor Dashboard"
            className="rounded-t-3xl h-auto object-cover w-full sm:w-auto"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
