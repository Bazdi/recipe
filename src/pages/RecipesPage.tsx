import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const RecipesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meine Rezepte</h1>
          <p className="text-gray-600 mt-2">
            Verwalten Sie Ihre Rezeptsammlung
          </p>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Neues Rezept
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">
            Noch keine Rezepte vorhanden. Erstellen Sie Ihr erstes Rezept!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
