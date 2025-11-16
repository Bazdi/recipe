import React from 'react';
import { Pencil, Trash2, Calendar, Package } from 'lucide-react';
import type { PantryItem, PantryCategory } from '../../types';
import { Card, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface PantryItemCardProps {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<PantryCategory, string> = {
  'Gemüse': 'bg-green-100 text-green-800',
  'Obst': 'bg-yellow-100 text-yellow-800',
  'Fleisch': 'bg-red-100 text-red-800',
  'Fisch': 'bg-blue-100 text-blue-800',
  'Milchprodukte': 'bg-purple-100 text-purple-800',
  'Getreide': 'bg-amber-100 text-amber-800',
  'Gewürze': 'bg-orange-100 text-orange-800',
  'Konserven': 'bg-gray-100 text-gray-800',
  'Tiefkühl': 'bg-cyan-100 text-cyan-800',
  'Sonstiges': 'bg-slate-100 text-slate-800',
};

export const PantryItemCard: React.FC<PantryItemCardProps> = ({
  item,
  onEdit,
  onDelete,
}) => {
  const isExpiringSoon = item.expiry_date
    ? new Date(item.expiry_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    : false;

  const isExpired = item.expiry_date
    ? new Date(item.expiry_date) < new Date()
    : false;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Item info */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              {item.photo_url ? (
                <img
                  src={item.photo_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-700">
                    {item.quantity}
                  </span>
                  <span className="text-sm text-gray-500">{item.unit}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      categoryColors[item.category as PantryCategory] || categoryColors.Sonstiges
                    }`}
                  >
                    {item.category}
                  </span>

                  {item.expiry_date && (
                    <Badge
                      variant={isExpired ? 'danger' : isExpiringSoon ? 'warning' : 'default'}
                      size="sm"
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(item.expiry_date)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="text-gray-600 hover:text-primary-600"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="text-gray-600 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
