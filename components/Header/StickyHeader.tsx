import React, { useState, useEffect, useRef } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer } from "antd";

interface NavItem {
  label: string;
  target: string;
}

interface StickyHeaderProps {
  navItems: NavItem[];
  actionItem: NavItem;
  logo: React.ReactNode;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  navItems,
  actionItem,
  logo,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      {
        root: null, // relative to viewport
        threshold: 0, // trigger when 0% of the marker is visible
      }
    );

    const marker = observerRef.current;
    if (marker) {
      observer.observe(marker);
    }

    // Cleanup the observer when the component is unmounted
    return () => {
      if (marker) observer.unobserve(marker);
    };
  }, []);

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Invisible marker at the top of the page */}
      <div ref={observerRef} className="absolute top-0 w-full h-1" />

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className={`text-xl font-bold transition-colors duration-500 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            <div className={`${isScrolled ? "block" : "block"}`}>
              <a href=".">{logo}</a>
            </div>
          </div>
          <nav className="hidden md:flex items-center">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={item.target} className="flex items-center">
                  <button
                    onClick={() => scrollToSection(item.target)}
                    className={`transition-colors duration-500 ${
                      isScrolled ? "text-gray-700" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li key={actionItem.target} className="flex items-center">
                <button
                  onClick={() => scrollToSection(actionItem.target)}
                  className={`transition-colors duration-500 ${
                    isScrolled ? "text-gray-700" : "text-gray-700"
                  } sm:p-3 sm:bg-[#34a853]/80 sm:hover:bg-[#34a853]/90 font-bold sm:rounded-lg sm:shadow-lg sm:transition-transform sm:duration-300 sm:transform sm:hover:scale-105`}
                >
                  {actionItem.label}
                </button>
              </li>
            </ul>
          </nav>
          <div className="flex items-center md:hidden gap-4">
            <button
              onClick={() => scrollToSection(actionItem.target)}
              className={`px-4 py-2 bg-[#34a853]/80 hover:bg-[#34a853]/90 font-bold rounded-3xl shadow-lg transition-transform duration-300 transform hover:scale-105 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {actionItem.label}
            </button>
            <MenuOutlined
              className={`text-2xl cursor-pointer transition-colors duration-500 ${
                isScrolled ? "text-gray-700" : "text-gray-700"
              }`}
              onClick={toggleDrawer}
            />
          </div>
          <Drawer
            placement="right"
            onClose={toggleDrawer}
            open={isDrawerVisible}
            closable={true}
          >
            <nav>
              <ul className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <li key={item.target}>
                    <button
                      onClick={() => {
                        scrollToSection(item.target);
                        toggleDrawer();
                      }}
                      className={`text-gray-700 text-lg`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </Drawer>
        </div>
      </header>
    </>
  );
};

export default StickyHeader;
