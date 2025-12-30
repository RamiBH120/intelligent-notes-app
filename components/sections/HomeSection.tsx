// components/HeroSection.jsx

import Image from 'next/image';
import Link from 'next/link';
import "@/app/styles/hero-section.css";
import { appName } from '@/lib/constants';
import AboutProjectButton from '../buttons/AboutProjectButton';

const HeroSection = () => {
  return (
    <section className="relative hero-photo">
      {/* Optional: Add a background image overlay or visual element */}
      {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}

      <div className="mx-auto w-full px-4 py-20 sm:px-6 lg:px-8 lg:py-24 relative">
        <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start md:space-x-10">
          <div className="md:flex-1 pb-10 md:pb-0 gap-y-6 flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className='text-white'>Welcome to </span><span className="text-indigo-500 hover:text-indigo-400 block transition-all duration-150">{appName}</span>
            </h1>
            <p className="mt-4 max-w-lg text-xl text-white">
              Here at {appName}, we believe in empowering individuals and organizations to reach their fullest potential through innovative note-taking solutions powered by AI.
            </p>
          </div>
          <div className="flex flex-col my-auto items-center justify-center gap-6 md:flex-1">

            {/* Secondary CTA (Optional) */}
            {/* <Link href="/learn-more" className="text-lg font-semibold leading-6 text-gray-300 hover:text-white">
              Learn more <span aria-hidden="true">→</span>
            </Link> */}

            {/* <Image
              src={"https://images.unsplash.com/photo-1517842645767-c639042777db?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bm90ZSUyMHRha2luZ3xlbnwwfHwwfHx8MA%3D%3D"}
              alt="Hero Image"
              width={500}
              height={300}
              loading='lazy'
              className=" rounded-lg shadow-lg bg-linear-120 mask-radial from-indigo-500 via-purple-500 to-pink-500 hover:bg-foreground transition-all duration-150 opacity-50 hover:opacity-100" /> */}

            {/* Primary CTA Button */}
            <Link href="/login" className="rounded-md bg-indigo-600 px-21 py-3 text-lg font-semibold text-white shadow-md transition duration-200 hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 border-accent-foreground">
              Get Started
            </Link>
            <AboutProjectButton />

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
