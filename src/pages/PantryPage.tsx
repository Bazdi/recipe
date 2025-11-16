import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const PantryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vorratsschrank</h1>
          <p className="text-gray-600 mt-2">
            Verwalten Sie Ihre Zutaten und Lebensmittel
          </p>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          Zutat hinzufügen
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">
            Ihr Vorratsschrank ist leer. Fügen Sie Ihre ersten Zutaten hinzu!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
