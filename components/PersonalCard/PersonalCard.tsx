import React from "react";
import { Avatar } from "antd";
import {
  FaFacebook,
  FaLinkedinIn,
  FaInstagram,
  FaInternetExplorer,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface PersonalCardProps {
  name: string;
  avatar: string;
  description: string;
  socialLinks: string[];
}

const PersonalCard: React.FC<PersonalCardProps> = ({
  name,
  avatar,
  description,
  socialLinks,
}) => {
  const getSocialIcon = (url: string) => {
    const domain = new URL(url).hostname.toLowerCase();

    if (domain.includes("facebook.com")) {
      return <FaFacebook className="w-6 h-6 hover:text-blue-600" />;
    } else if (domain.includes("twitter.com")) {
      return <FaXTwitter className="w-6 h-6 hover:text-blue-400" />;
    } else if (domain.includes("linkedin.com")) {
      return <FaLinkedinIn className="w-6 h-6 hover:text-blue-700" />;
    } else if (domain.includes("instagram.com")) {
      return <FaInstagram className="w-6 h-6 hover:text-pink-500" />;
    } else if (domain.includes("x.com")) {
      return <FaXTwitter className="w-6 h-6 hover:text-pink-500" />;
    } else {
      return <FaInternetExplorer className="w-6 h-6 hover:text-blue-700" />;
    }
  };

  return (
    <div className="p-4 flex flex-col items-center text-center bg-white rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
      <div className="mb-4">
        <Avatar
          src={avatar}
          size={100}
          className="border-none border-gray-300 shadow-md rounded-full"
        />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <div className="mt-4 flex justify-center space-x-4">
        {socialLinks.map((link, i) => (
          <a
            key={i}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
          >
            {getSocialIcon(link)}
          </a>
        ))}
      </div>
    </div>
  );
};

export default PersonalCard;
