import React from "react";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

function Footer() {
  return (
    <>
      <div className="top bg-[#EFF2F4] w-full sm:w-screen py-6 sm:py-10 px-4 sm:px-0 flex flex-col justify-center items-center">
        <h1 className="text-[4.5vw] text-[#222] tracking-tight font-semibold sm:text-[3vw] md:text-[2vw] leading-none text-center">
          Subscribe on our newsletter
        </h1>
        <p className="text-[#333] text-sm sm:text-[15px] mt-1 text-center">
          Get daily news on upcoming offers from many suppliers all over the
          world
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 w-full sm:w-auto">
          <input
            className="border border-solid border-[#DEE2E7] rounded-lg bg-white px-3 py-2 outline-none w-full sm:w-auto"
            type="text"
            placeholder="Email"
          />
          <button className="bg-blue-600 px-4 py-2 sm:py-1 rounded-md cursor-pointer text-white whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
      <div className="w-full lg:h-[55vh] h-auto">
        <div className="top pb-5 lg:h-[80%] w-full flex flex-col md:flex-row items-center justify-center md:items-stretch gap-6 md:gap-0 px-4 sm:px-8 md:px-0">
          <div className="left w-full md:w-[23%] flex flex-col items-center md:items-start justify-center gap-3">
            <img src="./logo.png" alt="logo" className="h-10 sm:h-12" />
            <p className="leading-none text-xs sm:text-[13px] text-[#505050] text-center md:text-left">
              Best information about the company gies here but now lorem ipsum
              is
            </p>
            <div className="flex flex-row items-center justify-center md:justify-start gap-2 mt-1">
              <Facebook fill="#fff" color="#fff00" width={34} height={34} className="rounded-full bg-zinc-300 p-2" />
              <Twitter fill="#fff" color="#fff00" width={34} height={34} className="rounded-full bg-zinc-300 p-2" />
              <Linkedin fill="#fff" color="#fff00" width={34} height={34} className="rounded-full bg-zinc-300 p-2" />
              <Instagram  color="#fff" width={34} height={34} className="rounded-full bg-zinc-300 p-2" />
              <Youtube color="#fff" width={34} height={34} className="rounded-full bg-zinc-300 p-2" />
            </div>
          </div>
          <div className="mid w-full md:w-[48%] flex flex-col sm:flex-row justify-center md:justify-around gap-6 sm:gap-4 items-center md:items-center px-0 md:px-5">
            {Array.from({length:4}).map((_, index) => (
              <div key={index} className="first text-center md:text-left">
                <h3 className="text-sm sm:text-[16px] font-medium text-[#1C1C1C]">About</h3>
                <div className="flex flex-col gap-1 text-[#8B96A5] mt-2 text-xs sm:text-[13px]">
                  <p>About Us</p>
                  <p>Find Store</p>
                  <p>Category</p>
                  <p>Blogs</p>
                </div>
              </div>
            ))}
          </div>
          <div className="right w-full md:w-[17%] flex flex-col justify-center items-center md:items-start gap-2">
           <h3 className="font-medium mt-1 text-sm sm:text-base">Get App</h3>
           <img src="./footer/app1.png" alt="app1" className="h-10 sm:h-12" />
           <img src="./footer/app2.png" alt="app2" className="h-10 sm:h-12" />
          </div>
        </div>
        <div className="bottom lg:h-[20%] text-[#606060] w-full bg-[#EFF2F4] border-t border-[#DEE2E7] border-solid flex flex-col sm:flex-row justify-center md:justify-between items-center gap-4 sm:gap-0 px-4 sm:px-8 md:px-20 py-4 md:py-0">
          <p className="text-center text-xs sm:text-[13px]">© 2024 Your Company Name. All rights reserved.</p>
          <select className="outline-none border-none p-2 text-xs sm:text-sm" name="language" id="language">
            <option value="English">English</option>
            <option value="Korean">Korean</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default Footer;
