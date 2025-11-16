import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Package, ShoppingCart, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Willkommen bei RecipeMaster - Ihr intelligentes Rezept-Tool
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rezepte</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <BookOpen className="w-12 h-12 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vorratsschrank</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Package className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Einkaufslisten</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktive Ziele</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Target className="w-12 h-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/recipes/new">
              <Button fullWidth variant="primary">
                Neues Rezept erstellen
              </Button>
            </Link>
            <Link to="/pantry">
              <Button fullWidth variant="secondary">
                Vorratsschrank verwalten
              </Button>
            </Link>
            <Link to="/search">
              <Button fullWidth variant="secondary">
                Rezepte suchen
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Erste Schritte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Vorratsschrank befüllen</h4>
                <p className="text-sm text-gray-600">
                  Fügen Sie Ihre verfügbaren Zutaten hinzu
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Rezepte entdecken</h4>
                <p className="text-sm text-gray-600">
                  Lassen Sie sich von der KI Rezepte vorschlagen
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Ziele setzen</h4>
                <p className="text-sm text-gray-600">
                  Definieren Sie Ihre Ernährungsziele
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
