import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-wattpad-orange mb-4">StoryCraft</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              The world's largest community of readers and writers. Share your stories, discover new worlds, 
              and connect with millions of passionate storytellers.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/browse"><span className="hover:text-white transition-colors">Browse Stories</span></Link></li>
              <li><Link href="/contests"><span className="hover:text-white transition-colors">Writing Contests</span></Link></li>
              <li><Link href="/resources"><span className="hover:text-white transition-colors">Writer Resources</span></Link></li>
              <li><Link href="/forums"><span className="hover:text-white transition-colors">Forums</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/help"><span className="hover:text-white transition-colors">Help Center</span></Link></li>
              <li><Link href="/safety"><span className="hover:text-white transition-colors">Safety</span></Link></li>
              <li><Link href="/guidelines"><span className="hover:text-white transition-colors">Guidelines</span></Link></li>
              <li><Link href="/contact"><span className="hover:text-white transition-colors">Contact Us</span></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 StoryCraft. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/privacy"><span className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</span></Link>
            <Link href="/terms"><span className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</span></Link>
            <Link href="/cookies"><span className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
