"use client";
import React from "react";
import HeroSection from "@/components/Hero/HeroSection";
import StickyHeader from "@/components/Header/StickyHeader";
import RegisterForm from "@/components/RegisterForm/RegisterForm";
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import Footer from "@/components/Footer/Footer";
import Gallery from "@/components/Gallery/Gallery";
import logo from "@/public/logos/logo_colorful.png";
import Image from "next/image";
import About from "@/components/About/About";
import MapBlock from "@/components/Map/Map";
import RandomSVGBackground from "@/components/Background/Background";
import PersonalCard from "@/components/PersonalCard/PersonalCard";
import { ConfigProvider, theme } from "antd";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  const navItems = [
    { label: t("Home"), target: "home" },
    { label: t("About"), target: "about" },
    { label: t("Gallery"), target: "gallery" },
    { label: t("Venue"), target: "venue" },
    { label: t("Team"), target: "team" },
  ];

  const actionItem = { label: "Get ticket", target: "ticket" };

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/GDGCloudHanoi",
      icon: <FaFacebook className="h-6 w-6" />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/gdgcloudhanoi",
      icon: <FaLinkedinIn className="h-6 w-6" />,
    },
    {
      name: "X",
      url: "https://x.com/GDGCloudHanoi",
      icon: <FaXTwitter className="h-6 w-6" />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/gdg.cloudhanoi/",
      icon: <FaInstagram className="h-6 w-6" />,
    },
    {
      name: "Youtube",
      url: "https://www.youtube.com/@GDGCloudHanoi",
      icon: <FaYoutube className="h-6 w-6" />,
    },
  ];

  const navLinkCategories = [
    {
      category: "About",
      links: [
        { label: "GDG Cloud Hanoi", url: "https://gdgcloudhanoi.dev/" },
        { label: "GDG", url: "https://developers.google.com/community/gdg" },
        {
          label: "DevFest",
          url: "https://developers.google.com/community/devfest",
        },
      ],
    },
    {
      category: "Support",
      links: [
        { label: "Facebook", url: "https://www.facebook.com/GDGCloudHanoi" },
        { label: "Email", url: "mailto:hello@gdgcloudhanoi.dev" },
      ],
    },
  ];

  const photoGallery = [
    { url: "/gallery/1.jpg" },
    { url: "/gallery/10.jpg" },
    { url: "/gallery/12.jpg" },
    { url: "/gallery/4.jpg" },
    { url: "/gallery/5.jpg" },
    { url: "/gallery/9.jpg" },
    { url: "/gallery/3.jpg" },
    { url: "/gallery/11.jpg" },
    { url: "/gallery/7.jpg" },
  ];

  const aboutData = [
    { id: 1, title: "500+", description: "Attendees" },
    { id: 2, title: "9", description: "Sessions" },
    { id: 3, title: "5", description: "Sponsorship\npartners" },
    { id: 4, title: "10", description: "Tech experts\n(Googlers, GDEs)" },
  ];

  const teams = [
    {
      name: "Truong Nguyen",
      avatar: "/teams/truong_nguyen.webp",
      description: "GDE / Head of GDG Cloud Hanoi",
      socialLinks: [
        "https://www.facebook.com/haitruong.bkhn",
        "https://twitter.com/truongnh92",
        "https://www.linkedin.com/in/truongnh1992/",
      ],
    },
    {
      name: "Huy Dang",
      avatar: "/teams/huy_dang.webp",
      description: "Co-Lead (Board Member)",
      socialLinks: [
        "https://www.facebook.com/dangduchuy1995",
        "https://twitter.com/Huyng68437057",
        "https://www.linkedin.com/in/huy-%C4%91%E1%BA%B7ng-b78963177/",
      ],
    },
    {
      name: "Amy Le",
      avatar: "/teams/amy_le.webp",
      description: "Partnership Lead (Board Member)",
      socialLinks: [
        "https://www.facebook.com/miu.espresso.1/",
        "https://www.linkedin.com/in/lethaomy/",
      ],
    },
    {
      name: "Minh Pham (Masi)",
      avatar: "/teams/minh_pham.webp",
      description: "Lead Designer",
      socialLinks: [
        "https://www.facebook.com/minhmasi17",
        "https://www.linkedin.com/in/monstieshin",
      ],
    },
    {
      name: "Minh Nguyễn Vũ Quang",
      avatar: "/teams/nvqm.webp",
      description: "Team Tech",
      socialLinks: ["https://www.linkedin.com/in/quangminhnv/"],
    },
    {
      name: "Kim Ung",
      avatar: "/teams/kim_ung.webp",
      description: "Partnership & Operation Team",
      socialLinks: [
        "https://www.facebook.com/kistenchan/",
        "https://www.linkedin.com/in/kim-ung/",
      ],
    },
    {
      name: "Son Tran Thai",
      avatar: "/teams/sownt.webp",
      description: "Tech Lead",
      socialLinks: [
        "https://www.facebook.com/thaison181/",
        "https://x.com/sowntt",
        "https://www.linkedin.com/in/sownt/",
      ],
    },
    {
      name: "My Hoa Le",
      avatar: "/teams/ltmh.webp",
      description: "PR Lead",
      socialLinks: [],
    },
    {
      name: "Hà Phạm",
      avatar: "/teams/ha_pham.webp",
      description: "Operation Lead",
      socialLinks: [],
    },
  ];

  const images = ["/icons/code.svg", "/icons/sharp.svg", "/icons/snow.svg"];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#34a853",
          fontFamily: "inherit",
        },
      }}
    >
      <RandomSVGBackground elements={images} />
      <div id="home" className="relative z-[10]">
        <div className="relative isolate flex flex-col min-h-svh w-full bg-slate-50/60">
          <StickyHeader
            navItems={navItems}
            actionItem={actionItem}
            logo={
              <Image className="h-8 w-auto" src={logo} alt="GDG Cloud Hanoi" />
            }
          />
          <HeroSection />
          <div id="about" className="pt-24 px-4">
            <div className="mx-auto max-w-6xl px-4">
              <h1 className="text-3xl font-bold">About</h1>
            </div>
            <About
              title="About"
              description={
                "Google Cloud DevFest Hanoi is one of the top tech events for developers in Hanoi, Vietnam. After four successful seasons, Google Cloud DevFest Hanoi 2024 is returning with a fresh format and many exciting activities that you won’t want to miss. Through in-depth discussions and hands-on workshops, you’ll have the opportunity to dive deep into topics such as Cloud Computing, AI and Data. Join us now!"
              }
              blocks={aboutData}
            />
          </div>
          <div id="gallery" className="pt-24">
            <div className="mx-auto max-w-6xl mb-8 px-4">
              <h1 className="text-3xl font-bold">Gallery</h1>
            </div>
            <Gallery
              photos={photoGallery}
              title="DevFest Cloud Hanoi 2023"
              description=""
              callToAction={{
                label: "SEE ALL PHOTOS",
                link: "https://drive.google.com/drive/folders/1wYij6OMCsx9gxK-0LqTWZ9ZBmsIm8ZC1",
              }}
            />
          </div>
          <div id="ticket" className="pt-24 px-4">
            <RegisterForm />
          </div>
          <div id="venue" className="pt-24">
            <div className="mx-auto max-w-6xl mb-8 px-4">
              <h1 className="text-3xl font-bold">Venue & Time</h1>
            </div>
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
              <MapBlock
                location={{
                  mapCenter: {
                    latitude: 21.017830590027167,
                    longitude: 105.84193181415745,
                  },
                  pointer: {
                    latitude: 21.017830590027167,
                    longitude: 105.84193181415745,
                    zoom: 18,
                  },
                  name: "Hotel du Parc HaNoi",
                  description: "9:00 ~ 17:30, Nov 30",
                  address:
                    "84 P. Trần Nhân Tông, Nguyễn Du, Hai Bà Trưng, Hà Nội",
                  link: "https://maps.app.goo.gl/2xd7ihaHqDyiQrkr6",
                }}
                googleMapApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              />
            )}
          </div>
          <div id="team" className="mx-auto max-w-6xl pt-24 px-4">
            <div className="mx-auto max-w-6xl mb-8 px-4">
              <h1 className="text-3xl font-bold">Team</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 content-center">
              {teams.map((item, index) => (
                <PersonalCard
                  key={index}
                  name={item.name}
                  avatar={item.avatar}
                  description={item.description}
                  socialLinks={item.socialLinks}
                />
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Footer
              socialLinks={socialLinks}
              navLinkCategories={navLinkCategories}
              logo={
                <Image
                  className="h-8 w-auto"
                  src={logo}
                  alt="GDG Cloud Hanoi"
                />
              }
              copyright="© 2024 All rights reserved."
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
