import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Package,
  Search,
  ShoppingCart,
  Calendar,
  Target,
  PieChart,
  Sparkles,
  Camera,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { name: 'Dashboard', path: '/', icon: Home },
    ],
  },
  {
    title: 'KI-Features',
    items: [
      { name: 'Rezept-Generator', path: '/ai-recipes', icon: Sparkles, badge: 'KI' },
      { name: 'Bilderkennung', path: '/image-recognition', icon: Camera, badge: 'KI' },
    ],
  },
  {
    title: 'Verwaltung',
    items: [
      { name: 'Rezepte', path: '/recipes', icon: BookOpen },
      { name: 'Vorratsschrank', path: '/pantry', icon: Package },
      { name: 'Einkaufsliste', path: '/shopping', icon: ShoppingCart },
      { name: 'Ziele', path: '/goals', icon: Target },
    ],
  },
  {
    title: 'Weitere Features',
    items: [
      { name: 'Rezeptsuche', path: '/search', icon: Search },
      { name: 'Meal Planning', path: '/planning', icon: Calendar },
      { name: 'Nährwerte', path: '/nutrition', icon: PieChart },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              RecipeMaster v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
