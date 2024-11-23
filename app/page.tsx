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
import SpeakerCard from "@/components/PersonalCard/SpeakerCard";

export default function Home() {
  const t = useTranslations();

  const navItems = [
    { label: t("Home"), target: "home" },
    { label: t("About"), target: "about" },
    { label: t("Speakers"), target: "speakers" },
    { label: t("Agenda"), target: "agenda" },
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

  const speakers = [
    {
      name: "Nhi Nguyễn",
      title: "Community Manager\n@ Google Developer Relations SEA",
      avatar: "/speakers/nhi_nguyen.png",
    },
    {
      name: "Võ Tự Đức",
      title: "CEO @ 2VO\nGoogle Developer Expert @ Google Workspace",
      avatar: "/speakers/vo_tu_duc.png",
    },
    {
      name: "Tú Phạm",
      title: "CEO @ AdFlex\nGoogle Developer Expert @ Google Cloud Platform",
      avatar: "/speakers/tu_pham.png",
    },
    {
      name: "Trường Nguyễn",
      title: "Founder @ GDG Cloud Hanoi\nGoogle Developer Expert @ Google Cloud Platform",
      avatar: "/speakers/truong_nguyen.png",
    },
    {
      name: "Hoan Lê",
      title: "Director of Corporate Customer @ Cloud Ace",
      avatar: "/speakers/hoan_le.png",
    },
    {
      name: "Nguyễn Xuân Hà",
      title: "Data Analytics Specialist Lead @ Google Cloud Vietnam",
      avatar: "/speakers/nguyen_xuan_ha.png",
    },
    {
      name: "Huy Đặng",
      title: "Co-Lead @ GDG Cloud Hanoi\nGoogle Developer Expert @ Google Cloud Platform",
      avatar: "/speakers/huy_dang.png",
    },
    {
      name: "Tuấn Vũ",
      title: "Solution Architect @ Cloud AZ",
      avatar: "/speakers/tuan_vu.png",
    },
    {
      name: "Tăng Trần",
      title: "Cloud Engineer @ BIDV",
      avatar: "/speakers/tang_tran.png",
    },
    {
      name: "Trần Minh Tú",
      title: "Data Scientist AAI-DnA @ Techcombank",
      avatar: "/speakers/tran_minh_tu.png",
    },
    {
      name: "Thái Hồ",
      title: "Solution Consultant Presales @ CMC Telecom",
      avatar: "/speakers/thai_ho.png",
    },
    {
      name: "Violet Đặng",
      title: "Customer Engineer @ Google",
      avatar: "/speakers/violet_dang.png",
    },
    {
      name: "Lê Thị Bích Thuận",
      title: "Udemy Instructor Founder & CEO @ UDECAREER",
      avatar: "/speakers/le_thi_bich_thuan.png",
    },
    {
      name: "Cleo Credo",
      title: "Digital MSME Engineering Lead Google Developer Expert @ Firebase",
      avatar: "/speakers/cleo.png",
    },
    {
      name: "Vũ Minh Hoàng",
      title: "Senior Data Scientist @ Viettel Solutions\nLecturer @ Thang Long University",
      avatar: "/speakers/vu_minh_hoang.png",
    },
  ];

  const teams = [
    {
      name: "Truong Nguyen",
      avatar: "/teams/truong_nguyen.webp",
      description: "GDE / Lead",
      socialLinks: [
        "https://www.facebook.com/haitruong.bkhn",
        "https://twitter.com/truongnh92",
        "https://www.linkedin.com/in/truongnh1992/",
      ],
    },
    {
      name: "Huy Dang",
      avatar: "/teams/huy_dang.webp",
      description: "GDE / Co-Lead",
      socialLinks: [
        "https://www.facebook.com/dangduchuy1995",
        "https://twitter.com/Huyng68437057",
        "https://www.linkedin.com/in/huy-%C4%91%E1%BA%B7ng-b78963177/",
      ],
    },
    {
      name: "Amy Le",
      avatar: "/teams/amy_le.webp",
      description: "Partnership Lead",
      socialLinks: [
        "https://www.facebook.com/miu.espresso.1/",
        "https://www.linkedin.com/in/lethaomy/",
      ],
    },
    {
      name: "Minh Pham",
      avatar: "/teams/minh_pham.webp",
      description: "Design Lead",
      socialLinks: [
        "https://www.facebook.com/minhmasi17",
        "https://www.linkedin.com/in/minhptn01/",
      ],
    },
    {
      name: "Minh Quang",
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
      name: "Son Tran",
      avatar: "/teams/sownt.webp",
      description: "Tech Lead",
      socialLinks: [
        "https://www.facebook.com/thaison181/",
        "https://x.com/sowntt",
        "https://www.linkedin.com/in/sownt/",
      ],
    },
    {
      name: "My Hoa",
      avatar: "/teams/ltmh.webp",
      description: "PR Lead",
      socialLinks: [
        "https://www.facebook.com/huu.ngaan",
        "https://linkedin.com/in/huungan",
      ],
    },
    {
      name: "Hà Phạm",
      avatar: "/teams/ha_pham.webp",
      description: "Operation Lead",
      socialLinks: [],
    },
    {
      name: "Luong PH",
      avatar: "/teams/luong.jpeg",
      description: "Media Lead",
      socialLinks: ["https://www.linkedin.com/in/luongph151/"],
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
          <div id="venue">
            {/* <div className="mx-auto max-w-6xl mb-8 px-4">
              <h1 className="text-3xl font-bold">Venue & Time</h1>
            </div> */}
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
          <div id="speakers" className="mx-auto max-w-6xl pt-24 px-4">
            <div className="mx-auto max-w-6xl mb-8 px-4">
              <h1 className="text-3xl font-bold">Speakers</h1>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 content-center">
              {speakers.map((item, index) => (
                <SpeakerCard
                  key={index}
                  name={item.name}
                  title={item.title}
                  avatar={item.avatar}
                />
              ))}
            </div>
          </div>
          <div id="agenda" className="mx-auto max-w-6xl pt-24 px-4">
            <div className="w-full">
              <Image
                src={"/agenda.png"}
                alt=""
                width={3840}
                height={4122}
                className="hidden sm:block w-full h-auto"
              />
              <Image
                src={"/agenda_mobile.png"}
                alt=""
                width={1456}
                height={8146}
                className="sm:hidden w-full h-auto"
              />
            </div>
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
          <div id="team" className="mx-auto max-w-6xl pt-24 px-4">
            <div className="mx-auto max-w-6xl mb-8 px-4">
              <h1 className="text-3xl font-bold">Core Team</h1>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 content-center">
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
