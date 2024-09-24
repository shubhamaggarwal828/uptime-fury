import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-24 relative bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-700">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-start items-center lg:gap-12 gap-10 inline-flex">
          <div className="w-full flex-col justify-start items-center gap-3 flex">
            <h2 className="w-full text-center text-gray-900 dark:text-white text-4xl font-bold font-manrope leading-normal">
              How It Works
            </h2>
            <p className="w-full text-center text-gray-500 dark:text-gray-300 text-base font-normal leading-relaxed">
              Discover the process behind our uptime monitoring service, 
              ensuring your websites are always online and running smoothly.
            </p>
          </div>
          <div className="w-full justify-start items-center gap-4 flex md:flex-row flex-col">
            <div className="grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex">
              <div className="self-stretch flex-col justify-start items-center gap-0.5 flex">
                <h3 className="self-stretch text-center text-[#287150] dark:text-[#35976b] text-4xl font-extrabold font-manrope leading-normal">
                  1
                </h3>
                <h4 className="self-stretch text-center text-gray-900 dark:text-white text-xl font-semibold leading-8">
                  Monitoring Setup
                </h4>
              </div>
              <p className="self-stretch text-center text-gray-400 dark:text-gray-300 text-base font-normal leading-relaxed">
                Define the websites you want to monitor and configure
                frequency settings for checks, ensuring timely notifications.
              </p>
            </div>
            <svg
              className="md:flex hidden"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5.50159 6L11.5018 12.0002L5.49805 18.004M12.5016 6L18.5018 12.0002L12.498 18.004"
                stroke="#287150"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex">
              <div className="self-stretch flex-col justify-start items-center gap-0.5 flex">
                <h3 className="self-stretch text-center text-[#287150] dark:text-[#35976b] text-4xl font-extrabold font-manrope leading-normal">
                  2
                </h3>
                <h4 className="self-stretch text-center text-gray-900 dark:text-white text-xl font-semibold leading-8">
                  Continuous Monitoring
                </h4>
              </div>
              <p className="self-stretch text-center text-gray-400 dark:text-gray-300 text-base font-normal leading-relaxed">
                Our system continuously checks the availability and response
                times of your websites, ensuring they are always accessible.
              </p>
            </div>
            <svg
              className="md:flex hidden"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5.50159 6L11.5018 12.0002L5.49805 18.004M12.5016 6L18.5018 12.0002L12.498 18.004"
                stroke="#287150"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="grow shrink basis-0 flex-col justify-start items-center gap-2.5 inline-flex">
              <div className="self-stretch flex-col justify-start items-center gap-0.5 flex">
                <h3 className="self-stretch text-center text-[#287150] dark:text-[#35976b] text-4xl font-extrabold font-manrope leading-normal">
                  3
                </h3>
                <h4 className="self-stretch text-center text-gray-900 dark:text-white text-xl font-semibold leading-8">
                  Alerts and Reports
                </h4>
              </div>
              <p className="self-stretch text-center text-gray-400 dark:text-gray-300 text-base font-normal leading-relaxed">
                Receive immediate alerts via email or other channels when 
                downtime occurs, along with detailed reports to help resolve issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
