import React, { useState } from "react";
import { FaLock, FaClock, FaBell, FaChartLine, FaComments } from "react-icons/fa";

const Uptime_Monitoring_Info = () => {
  // Initialize the dark mode state
  const [darkMode, setDarkMode] = useState(false);

  return (
    <section className="py-24 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-700 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-14 items-center lg:grid-cols-12 lg:gap-32">
          <div className="w-full xl:col-span-5 lg:col-span-6 2xl:-mx-5 xl:-mx-0 mx-auto">
            <div className="relative text-center lg:text-left">
              <span className="text-base font-semibold leading-7 text-[#287150] dark:text-[#35976b]">
                Our Features
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold sm:leading-[3.25rem] text-center lg:text-left">
                Reliable Uptime Monitoring at Your Fingertips
              </h2>
            </div>

            <div className="grid gap-8 my-12 md:max-w-2xl max-w-lg mx-auto lg:max-w-full">
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <FaLock className="h-6 w-6 text-[#287150] dark:text-[#35976b]" />
                <div>
                  <h4 className="mb-2 text-lg font-medium">100% Uptime Guarantee</h4>
                  <p className="text-sm font-normal leading-6">
                    Our service ensures your website stays online, with real-time monitoring to prevent outages.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <FaClock className="h-6 w-6 text-[#287150] dark:text-[#35976b]" />
                <div>
                  <h4 className="mb-2 text-lg font-medium">Instant Alerts</h4>
                  <p className="text-sm font-normal leading-6">
                    Get immediate notifications via email or SMS if your site goes down, so you can act quickly.
                  </p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <FaBell className="h-6 w-6 text-[#287150] dark:text-[#35976b]" />
                <div>
                  <h4 className="mb-2 text-lg font-medium">Detailed Reporting</h4>
                  <p className="text-sm font-normal leading-6">
                    Access comprehensive reports and insights into your site's performance over time.
                  </p>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="flex items-start gap-4">
                <FaChartLine className="h-6 w-6 text-[#287150] dark:text-[#35976b]" />
                <div>
                  <h4 className="mb-2 text-lg font-medium">Performance Metrics</h4>
                  <p className="text-sm font-normal leading-6">
                    Monitor key performance indicators to ensure your website is running optimally.
                  </p>
                </div>
              </div>
              {/* Feature 5 */}
              <div className="flex items-start gap-4">
                <FaComments className="h-6 w-6 text-[#287150] dark:text-[#35976b]" />
                <div>
                  <h4 className="mb-2 text-lg font-medium">Multiple Notification Channels</h4>
                  <p className="text-sm font-normal leading-6">
                    Choose how you receive alerts—via email, SMS, or other platforms—tailored to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full xl:col-span-7 lg:col-span-6 hidden lg:block mx-auto">
            <div className="w-full sm:w-auto lg:w-[60.8125rem] max-w-full">
              <img
                src="https://pagedone.io/asset/uploads/1695031065.png"
                alt="Feature tailwind section"
                className="w-full rounded-3xl lg:h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Uptime_Monitoring_Info;
