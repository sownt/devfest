'use client'
import React from 'react';
import HeroSection from '@/components/Hero/HeroSection';
import StickyHeader from '@/components/Header/StickyHeader';
import RegisterForm from '@/components/RegisterForm/RegisterForm';
import { FaFacebook, FaXTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa6';
import Footer from '@/components/Footer/Footer';
import Gallery from '@/components/Gallery/Gallery';
import logo from '@/public/logos/logo_colorful.png';
import Image from 'next/image';
import About from '@/components/About/About';
import RandomSVGBackground from '@/components/Background/Background';

export default function Home() {
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'DevFest Cloud 2023', href: '#recap' },
    { label: 'Get ticket', href: '#ticket', styles: 'sm:p-3 sm:bg-[#34a853]/80 sm:hover:bg-[#34a853]/90 font-bold sm:rounded-lg sm:shadow-lg sm:transition-transform sm:duration-300 sm:transform sm:hover:scale-105' }
  ];

  const socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/GDGCloudHanoi', icon: <FaFacebook className="h-6 w-6" /> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/gdgcloudhanoi', icon: <FaLinkedinIn className="h-6 w-6" /> },
    { name: 'X', url: 'https://x.com/GDGCloudHanoi', icon: <FaXTwitter className="h-6 w-6" /> },
    { name: 'Instagram', url: 'https://www.instagram.com/gdg.cloudhanoi/', icon: <FaInstagram className="h-6 w-6" /> },
    { name: 'Youtube', url: 'https://www.youtube.com/@GDGCloudHanoi', icon: <FaYoutube className="h-6 w-6" /> },
  ];

  const navLinkCategories = [
    {
      category: 'About',
      links: [
        { label: 'GDG Cloud Hanoi', url: 'https://gdgcloudhanoi.dev/' },
        { label: 'GDG', url: 'https://developers.google.com/community/gdg' },
        { label: 'DevFest', url: 'https://developers.google.com/community/devfest' },
      ],
    },
    {
      category: 'Support',
      links: [
        { label: 'Facebook', url: 'https://www.facebook.com/GDGCloudHanoi' },
        { label: 'Email', url: 'mailto:hello@gdgcloudhanoi.dev' },
      ],
    },
  ];

  const photoGallery = [
    { url: '/devfest2023/1.jpg' },
    { url: '/devfest2023/2.jpg' },
    { url: '/devfest2023/3.jpg' },
    { url: '/devfest2023/4.jpg' },
    { url: '/devfest2023/5.jpg' },
    { url: '/devfest2023/6.jpg' },
    { url: '/devfest2023/7.jpg' },
    { url: '/devfest2023/8.jpg' },
  ];

  const aboutData = [
    { id: 1, title: '300+', description: 'Attendees' },
    { id: 2, title: '8+', description: 'Sessions' },
  ];

  const images = [
    '/icons/code.svg',
    '/icons/sharp.svg',
    '/icons/snow.svg',
  ];

  return (
    <>
      <RandomSVGBackground elements={images} />
      <div id="home" className="relative z-10 ">
        <div className="relative isolate flex flex-col min-h-svh w-full bg-slate-50">
          <StickyHeader navItems={navItems} logo={<Image className='h-8 w-auto' src={logo} alt="GDG Cloud Hanoi" />} />
          <HeroSection title='DevFest Cloud Hanoi'
            subtitle='is back on November 30'
            backgroundImage='/banner/banner.png'
            mobileBackgroundImage='/banner/banner_mobile.png'>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="#learn-more"
                className="px-6 py-3 bg-transparent hover:bg-black/20 text-white font-semibold rounded-lg hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
              >
                {"#DevFest2023"}
              </a>

            </div>
          </HeroSection>
          <div id="about" className="pt-24 px-4">
            <div className="mx-auto max-w-6xl px-4">
              <h1 className="text-3xl font-bold">About</h1>
            </div>
            <About
              title="About"
              description={"DevFests are local tech conferences hosted by Google Developer Groups (GDGs) around the world. DevFest is the premiere local event for developers to learn about Google's latest technologies from Googlers, Google Developer Experts and speakers from the industry."}
              blocks={aboutData}
            />
          </div>
          <div id="recap" className='pt-24'>
            <div className="mx-auto max-w-6xl mb-8 px-4">
              <h1 className="text-3xl font-bold">DevFest Cloud 2023</h1>
            </div>
            <Gallery
              photos={photoGallery}
              title="DevFest Cloud Hanoi 2023"
              description=""
              callToAction={{
                label: 'SEE ALL PHOTOS',
                link: 'https://drive.google.com/drive/folders/1wYij6OMCsx9gxK-0LqTWZ9ZBmsIm8ZC1',
              }}
            />
          </div>
          <div id="ticket" className='pt-24 px-4'>
            <RegisterForm />
          </div>
          <div className="mt-8">
            <Footer
              socialLinks={socialLinks}
              navLinkCategories={navLinkCategories}
              logo={<Image className='h-8 w-auto' src={logo} alt="GDG Cloud Hanoi" />}
              copyright="©2024 GDG Cloud Hanoi. All rights reserved."
            />
          </div>
        </div>
      </div>
    </>
  );
}
