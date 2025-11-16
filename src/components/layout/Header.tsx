import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            )}

            <Link to="/" className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">RecipeMaster</span>
            </Link>
          </div>

          {/* Right: User menu */}
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.user_metadata?.display_name || 'Benutzer'}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>

                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
