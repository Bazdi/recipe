import React, { useState } from 'react';
import { Plus, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import { useShoppingLists } from '../hooks/useShoppingLists';
import { ShoppingListCard, AddShoppingListModal } from '../components/shopping';
import { Card, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';

export const ShoppingPage: React.FC = () => {
  const { lists, loading, error, addList, updateList, deleteList, getActiveLists, refreshLists } =
    useShoppingLists();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showActive, setShowActive] = useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm('Möchten Sie diese Einkaufsliste wirklich löschen?')) {
      await deleteList(id);
    }
  };

  const handleShowActive = async () => {
    if (!showActive) {
      await getActiveLists();
      setShowActive(true);
    } else {
      await refreshLists();
      setShowActive(false);
    }
  };

  // Calculate stats
  const activeLists = lists.filter((l) => l.status === 'Aktiv').length;
  const completedLists = lists.filter((l) => l.status === 'Abgeschlossen').length;
  const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
  const checkedItems = lists.reduce(
    (sum, list) => sum + list.items.filter((item) => item.checked).length,
    0
  );

  if (loading) {
    return <Loading fullScreen text="Lade Einkaufslisten..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Einkaufslisten</h1>
          <p className="text-gray-600 mt-2">Planen und organisieren Sie Ihre Einkäufe</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showActive ? 'primary' : 'secondary'}
            onClick={handleShowActive}
          >
            {showActive ? 'Alle anzeigen' : 'Nur Aktive'}
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Neue Liste
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Gesamt Listen</p>
                <p className="text-2xl font-bold text-gray-900">{lists.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktiv</p>
                <p className="text-2xl font-bold text-blue-600">{activeLists}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Abgeschlossen</p>
                <p className="text-2xl font-bold text-green-600">{completedLists}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="text-2xl">✓</div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Artikel erledigt</p>
                <p className="text-2xl font-bold text-gray-900">
                  {checkedItems}/{totalItems}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Grid */}
      {lists.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Noch keine Einkaufslisten vorhanden. Erstellen Sie Ihre erste Liste!
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Erste Liste erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <ShoppingListCard
              key={list.id}
              list={list}
              onUpdate={updateList}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddShoppingListModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addList}
      />
    </div>
  );
};
