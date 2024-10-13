import React from 'react';
import Link from 'next/link';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode; // SVG or Icon component
}

interface NavLinkCategory {
  category: string;
  links: { label: string; url: string }[];
}

interface FooterProps {
  socialLinks: SocialLink[];
  navLinkCategories: NavLinkCategory[]; // Links are categorized
  logo: React.ReactNode; // URL to the logo image in public folder
  copyright: string; // Copyright text
}

const Footer: React.FC<FooterProps> = ({ socialLinks, navLinkCategories, logo, copyright }) => {
  return (
    <footer className="bg-[#F5F5F5] text-[rgb(97, 97, 97)] mt-8">
      {/* Social Links Row */}
      <div className="container mx-auto py-8 flex justify-center space-x-6">
        {socialLinks.map((link, idx) => (
          <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            {link.icon}
            <span className="sr-only">{link.name}</span>
          </a>
        ))}
      </div>

      {/* Divider */}
      <hr className="border-gray-400/50 max-w-6xl mx-auto px-8" />

      {/* Navigation Links with Multiple Columns */}
      <div className="container max-w-6xl mx-auto py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 text-center px-4">
        {navLinkCategories.map((category, idx) => (
          <div key={idx}>
            <h3 className="text-xl text-gray font-semibold mb-3">{category.category}</h3>
            <ul>
              {category.links.map((link, linkIdx) => (
                <li key={linkIdx} className="my-2">
                  <Link href={link.url} className="text-sm font-normal text-gray">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <hr className="border-gray-400/50 max-w-6xl mx-auto px-8" />

      {/* Logo and Copyright Row */}
      <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 px-4 py-8">
        {/* Logo */}
        <a href=".">{logo}</a>

        {/* Copyright */}
        <p className="text-sm text-gray">{copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
