import React from 'react';
import { ShoppingCart, Trash2, Check, Circle } from 'lucide-react';
import type { ShoppingList } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ShoppingListCardProps {
  list: ShoppingList;
  onUpdate: (id: string, updates: Partial<ShoppingList>) => Promise<void>;
  onDelete: (id: string) => void;
}

const statusColors = {
  Aktiv: 'info',
  Abgeschlossen: 'success',
  Archiviert: 'default',
} as const;

export const ShoppingListCard: React.FC<ShoppingListCardProps> = ({
  list,
  onUpdate,
  onDelete,
}) => {
  const totalItems = list.items.length;
  const checkedItems = list.items.filter((item) => item.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const handleToggleItem = async (itemIndex: number) => {
    const updatedItems = list.items.map((item, index) =>
      index === itemIndex ? { ...item, checked: !item.checked } : item
    );

    await onUpdate(list.id, { items: updatedItems });
  };

  const handleCompleteList = async () => {
    await onUpdate(list.id, { status: 'Abgeschlossen' });
  };

  const handleReactivateList = async () => {
    await onUpdate(list.id, { status: 'Aktiv' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-primary-600" />
            <div>
              <CardTitle className="text-lg">{list.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {checkedItems} von {totalItems} erledigt
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusColors[list.status]}>{list.status}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(list.id)}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Progress Bar */}
        {totalItems > 0 && (
          <div className="mb-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {list.items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition ${
                item.checked ? 'opacity-50' : ''
              }`}
              onClick={() => handleToggleItem(index)}
            >
              <div className="flex-shrink-0">
                {item.checked ? (
                  <div className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>

              <div className="flex-1">
                <p
                  className={`text-sm ${
                    item.checked ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}
                >
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.quantity} {item.unit}
                  {item.category && ` • ${item.category}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        {list.status === 'Aktiv' && totalItems > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleCompleteList}
              disabled={checkedItems !== totalItems}
            >
              {checkedItems === totalItems ? 'Als erledigt markieren' : 'Noch nicht vollständig'}
            </Button>
          </div>
        )}

        {list.status === 'Abgeschlossen' && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={handleReactivateList}
            >
              Wieder aktivieren
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
