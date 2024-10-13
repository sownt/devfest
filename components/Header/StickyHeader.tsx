import React, { useState, useEffect } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';

interface NavItem {
  label: string;
  href: string;
  styles?: string;
}

interface StickyHeaderProps {
  navItems: NavItem[];
  logo: React.ReactNode;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ navItems, logo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if the scroll position is greater than 50px
      setIsScrolled(window.scrollY > 50);
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle drawer visibility
  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className={`text-xl font-bold transition-colors duration-500 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
          <div className={`${isScrolled ? 'block' : 'block'}`}>
            <a href=".">
              {logo}
            </a>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`transition-colors duration-500 ${isScrolled ? 'text-gray-700' : 'text-gray-700'} ${item.styles}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger Menu for Mobile */}
        <div className="flex md:hidden gap-4">
          <a
            href="#ticket"
            className={`p-3 bg-[#34a853]/80 hover:bg-[#34a853]/90 font-bold rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            Get ticket
          </a>
          <MenuOutlined
            className={`text-2xl cursor-pointer transition-colors duration-500 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={toggleDrawer}
          />
        </div>

        {/* Ant Design Drawer for Mobile Menu */}
        <Drawer
          title=""
          placement="right"
          onClose={toggleDrawer}
          open={isDrawerVisible}
          closable={true}
          styles={{ body: { padding: 0 } }}
        >
          <nav>
            <ul className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`text-gray-700 text-lg ${item.styles}`}
                    onClick={toggleDrawer} // Close drawer on navigation click
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Drawer>
      </div>
    </header>
  );
};

export default StickyHeader;
