import React from "react";
import Uptime_Monitoring_Info from "../components/Uptime_Monitoring_Info/Uptime_Monitoring_Info";
import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaCreditCard, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { motion } from "framer-motion";
import FaqSection from "../components/FaqSection/FaqSection";
import GetStarted from "../components/GetStarted/GetStarted";

const AboutUs = () => {
  const isDarkMode = false;
  const itemVariants = {};

  const features = [
    {
      title: "Easy Payment",
      description:
        "We Provide Various Methods For You To Carry Out All Transactions Related To Your Finances",
      icon: FaCreditCard,
    },
    {
      title: "Safe Transaction",
      description:
        "We have the most up-to-date security to support the security of all our customers in carrying out all transactions.",
      icon: FaShieldAlt,
    },
    {
      title: "Fast Customer Service",
      description:
        "Provide Customer Service For Those Of You Who Have Problems 24 Hours A Week",
      icon: FaHeadset,
    },
  ];

  const TeamMember = ({ name, title, description, imageUrl }) => {
    return (
      <div className="group w-full flex flex-wrap items-center gap-8 transition-all duration-500 p-8 lg:flex-nowrap">
        <div className="w-full lg:w-48 h-64">
          <img
            src={imageUrl}
            alt={name}
            className="rounded-2xl h-full object-cover mx-auto lg:mx-0 lg:w-full"
          />
        </div>
        <div className="text-center lg:text-left lg:max-w-xs flex-1">
          <div className="mb-5 pb-5 border-b border-solid border-gray-300">
            <h6 className="text-lg text-gray-900 dark:text-white font-semibold mb-1">
              {name}
            </h6>
            <span className="text-sm font-bold text-[#287150] dark:text-[#35976b] group-hover:text-[#287150] dark:text-[#35976b]">
              {title}
            </span>
          </div>
          <p className="text-gray-500 leading-6 mb-7">{description}</p>
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <p className="cursor-pointer text-gray-900 hover:text-white group w-12 h-12 rounded-full flex justify-center items-center bg-gray-100 transition-all duration-500 hover:bg-[#35976b]">
              <FaTwitter className="w-5 h-5" />
            </p>
            <p className="cursor-pointer text-gray-900 hover:text-white group w-12 h-12 rounded-full flex justify-center items-center bg-gray-100 transition-all duration-500 hover:bg-[#35976b]">
              <FaInstagram className="w-5 h-5" />
            </p>
            <p className="cursor-pointer text-gray-900 hover:text-white group w-12 h-12 rounded-full flex justify-center items-center bg-gray-100 transition-all duration-500 hover:bg-[#35976b]">
              <FaLinkedin className="w-5 h-5" />
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <section className="py-14 lg:py-24 relative z-0 bg-gray-50 dark:bg-[#121212] bg-[#ffffff] border-b border-gray-200 dark:border-gray-700">
        <motion.div
          className="border p-1 w-full sm:w-auto mx-auto rounded-full flex items-center justify-between"
          style={{
            color: isDarkMode ? "#35976b" : "#287150",
            fontFamily: "Slabo 27px, serif",
            fontWeight: 700,
            maxWidth: "fit-content",
          }}
          variants={itemVariants}
        >
          <span className="font-inter text-sm font-large text-gray-900 ml-3 dark:text-white">
            About Us
          </span>
          <a
            href="#"
            className="w-8 h-8 rounded-full flex justify-center items-center ml-3"
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

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
          <h1 className="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl text-gray-900 dark:text-gray-100 mb-5 md:text-5xl md:leading-normal mt-3">
            Keep your sites online with our
            <span className="text-[#287150]"> Uptime Monitor</span>
          </h1>
          <p className="max-w-sm mx-auto text-center text-base font-normal leading-7 text-gray-500 dark:text-white">
            Monitor your site's performance and reliability with instant alerts
            and global visibility. Ensure your services are always online and
            optimized.
          </p>
        </div>
      </section>

      <Uptime_Monitoring_Info />

      <section className="py-24 bg-gray-50 dark:bg-[#121212] bg-[#1f1f1f] border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 lg:mb-16 flex justify-center items-center flex-col gap-x-0 gap-y-6 lg:gap-y-0 lg:flex-row lg:justify-between max-md:max-w-lg max-md:mx-auto">
            <div className="relative w-full text-center lg:text-left lg:w-2/4">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 leading-[3.25rem] lg:mb-6 mx-auto max-w-max lg:max-w-md lg:mx-0">
                Enjoy the finest features with our products
              </h2>
            </div>
            <div className="relative w-full text-center lg:text-left lg:w-2/4">
              <p className="text-lg font-normal text-gray-500 dark:text-white mb-5">
                We provide all the advantages that can simplify all your
                financial transactions without any further requirements
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-x-5 gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative w-full bg-gray-100 dark:bg-[#1f1f1f] rounded-2xl p-4 transition-all duration-500 max-md:max-w-md max-md:mx-auto md:w-1/3 md:h-64 xl:p-7 xl:w-1/3 border border-black dark:border-gray-300"
              >
                <div className=" rounded-full flex justify-center items-center mb-5 w-14 h-14">
                  <feature.icon
                    className="text-[#287150] dark:text-[#35976b] group-hover:text-[#287150]"
                    size={30}
                  />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 capitalize transition-all duration-500 group-hover:text-black dark:group-hover:text-white">
                  {feature.title}
                </h4>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400 transition-all duration-500 leading-5 group-hover:text-black dark:group-hover:text-white">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-white dark:bg-[#121212] px-6 py-24 sm:py-32 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,#121212,#000000)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white dark:bg-[#121212] sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <figure className="mt-10">
            <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 dark:text-gray-100 sm:text-2xl sm:leading-9">
              <p>
                “Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
                expedita voluptas culpa sapiente alias molestiae. Numquam
                corrupti in laborum sed rerum et corporis.”
              </p>
            </blockquote>
            <figcaption className="mt-10">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="mx-auto h-10 w-10 rounded-full"
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  Judith Black
                </div>
                <svg
                  width={3}
                  height={3}
                  viewBox="0 0 2 2"
                  aria-hidden="true"
                  className="fill-gray-900 dark:fill-gray-100"
                >
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <div className="text-gray-600 dark:text-gray-400">
                  CEO of Workcation
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="py-14 lg:py-24 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-24">
            <h2 className="font-manrope text-4xl text-center font-bold text-gray-900 dark:text-white mb-6">
              Meet our soldier of finance
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 text-center">
              We provide all the advantage that can simplify all your financial
              and banking support without any further issues.
            </p>
          </div>
          <div className="group w-full flex-wrap flex items-center gap-8 transition-all duration-500 p-8 lg:flex-nowrap">
            <TeamMember
              name="Harsh Patel"
              title="Co-Founder & CEO"
              description="I am the co-founder of pagedone and we’ve pushed our limit so far to make it successful."
              imageUrl="https://pagedone.io/asset/uploads/1696238869.png"
            />
            <TeamMember
              name="Alexa Kimberly"
              title="Lead Designer"
              description="I’ve been lead designer for pagedone since the beginning of it and enjoyed every bit."
              imageUrl="https://pagedone.io/asset/uploads/1696238869.png"
            />
          </div>
        </div>
      </section>

      <FaqSection />

      <GetStarted />


    </div>
  );
};

export default AboutUs;
