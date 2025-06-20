import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, Bookmark, Bell, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "@/components/search-bar";

export default function Navbar() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Discover", active: location === "/" },
    { href: "/browse", label: "Browse", active: location === "/browse" },
    { href: "/community", label: "Community", active: location === "/community" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-wattpad-orange">StoryCraft</h1>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className={`px-3 py-2 text-sm font-medium transition-colors ${
                      item.active 
                        ? "text-gray-900" 
                        : "text-gray-600 hover:text-wattpad-orange"
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/write">
              <Button className="bg-wattpad-orange text-white hover:bg-wattpad-orange-dark">
                <PenTool className="w-4 h-4 mr-2" />
                Write
              </Button>
            </Link>
            
            <div className="hidden sm:flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-wattpad-orange">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-wattpad-orange">
                <Bell className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-wattpad-orange text-white text-sm">A</AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span className={`block px-3 py-2 text-base font-medium transition-colors ${
                        item.active 
                          ? "text-gray-900" 
                          : "text-gray-600 hover:text-wattpad-orange"
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Bookmarks
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
