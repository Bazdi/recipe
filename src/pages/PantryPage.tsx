import React, { useState } from 'react';
import { Plus, AlertCircle, Filter } from 'lucide-react';
import { usePantry } from '../hooks/usePantry';
import { PantryItemCard, AddPantryItemModal, EditPantryItemModal } from '../components/pantry';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { Badge } from '../components/common/Badge';
import type { PantryItem, PantryCategory } from '../types';

const categories: PantryCategory[] = [
  'Gemüse',
  'Obst',
  'Fleisch',
  'Fisch',
  'Milchprodukte',
  'Getreide',
  'Gewürze',
  'Konserven',
  'Tiefkühl',
  'Sonstiges',
];

export const PantryPage: React.FC = () => {
  const { items, loading, error, addItem, updateItem, deleteItem } = usePantry();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showExpiring, setShowExpiring] = useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie diesen Artikel wirklich löschen?')) {
      await deleteItem(id);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory && item.category !== selectedCategory) {
      return false;
    }

    if (showExpiring) {
      if (!item.expiry_date) return false;
      const expiryDate = new Date(item.expiry_date);
      const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return expiryDate <= sevenDaysFromNow;
    }

    return true;
  });

  // Count expiring items
  const expiringCount = items.filter((item) => {
    if (!item.expiry_date) return false;
    const expiryDate = new Date(item.expiry_date);
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return expiryDate <= sevenDaysFromNow;
  }).length;

  if (loading) {
    return <Loading fullScreen text="Lade Vorratsschrank..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vorratsschrank</h1>
          <p className="text-gray-600 mt-2">
            Verwalten Sie Ihre Zutaten und Lebensmittel
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Zutat hinzufügen
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Gesamt Artikel</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{items.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Kategorien</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {new Set(items.map((i) => i.category)).size}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowExpiring(!showExpiring)}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Läuft bald ab</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{expiringCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filter:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? 'info' : 'default'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => setSelectedCategory(null)}
            >
              Alle ({items.length})
            </Badge>

            {categories.map((cat) => {
              const count = items.filter((i) => i.category === cat).length;
              if (count === 0) return null;

              return (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? 'info' : 'default'}
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({count})
                </Badge>
              );
            })}

            {expiringCount > 0 && (
              <Badge
                variant={showExpiring ? 'warning' : 'default'}
                className="cursor-pointer hover:opacity-80"
                onClick={() => setShowExpiring(!showExpiring)}
              >
                Läuft bald ab ({expiringCount})
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">
              {items.length === 0
                ? 'Ihr Vorratsschrank ist leer. Fügen Sie Ihre ersten Zutaten hinzu!'
                : 'Keine Artikel gefunden für die ausgewählten Filter.'}
            </p>
            {items.length === 0 && (
              <Button
                className="mt-4"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Erste Zutat hinzufügen
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <PantryItemCard
              key={item.id}
              item={item}
              onEdit={setEditingItem}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddPantryItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addItem}
      />

      <EditPantryItemModal
        isOpen={editingItem !== null}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdate={updateItem}
      />
    </div>
  );
};
