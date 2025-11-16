import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Sparkles, AlertCircle, Plus } from 'lucide-react';
import { useGemini } from '../hooks/useGemini';
import { usePantry } from '../hooks/usePantry';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Loading } from '../components/common/Loading';

export const ImageRecognitionPage: React.FC = () => {
  const { analyzeImage, loading, error } = useGemini();
  const { addItem } = usePantry();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Convert to base64 for API
    const base64Reader = new FileReader();
    base64Reader.onload = async () => {
      const base64 = (base64Reader.result as string).split(',')[1];

      const result = await analyzeImage({
        imageBase64: base64,
        type: 'pantry',
      });

      if (result) {
        setAnalysisResult(result);
      }
    };
    base64Reader.readAsDataURL(file);
  }, [analyzeImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  });

  const handleAddToPantry = async (item: any) => {
    try {
      await addItem({
        name: item.name,
        quantity: item.quantity || 1,
        unit: item.unit || 'Stück',
        category: 'Sonstiges' as any,
        expiry_date: null,
        photo_url: null,
      });
      alert(`${item.name} wurde zum Vorratsschrank hinzugefügt!`);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Fehler beim Hinzufügen des Artikels');
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Camera className="w-8 h-8 text-primary-600" />
          Bilderkennung
        </h1>
        <p className="text-gray-600 mt-2">
          Laden Sie ein Foto hoch und lassen Sie KI die Lebensmittel erkennen
        </p>
      </div>

      {/* API Key Warning */}
      {!import.meta.env.VITE_GEMINI_API_KEY && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="font-semibold mb-1">⚠️ Gemini API-Schlüssel fehlt</p>
          <p className="text-sm">
            Bitte setzen Sie <code className="bg-yellow-100 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code> in Ihrer .env Datei,
            um die Bilderkennung zu nutzen.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Bild hochladen</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-gray-600">Bild hier ablegen...</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">
                    Ziehen Sie ein Bild hierher oder klicken Sie zum Auswählen
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG oder WEBP (max. 10MB)
                  </p>
                </>
              )}
            </div>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleReset} variant="secondary" fullWidth>
                    Neu hochladen
                  </Button>
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-4">
                <Loading text="Analysiere Bild..." />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Erkannte Lebensmittel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!analysisResult && !loading && (
              <p className="text-gray-500 text-center py-8">
                Laden Sie ein Bild hoch, um mit der Analyse zu beginnen
              </p>
            )}

            {analysisResult && analysisResult.detectedItems && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {analysisResult.detectedItems.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <Badge className="bg-primary-100 text-primary-700 text-xs">
                            {Math.round(item.confidence * 100)}% sicher
                          </Badge>
                        </div>
                        {item.quantity && (
                          <p className="text-sm text-gray-600">
                            ca. {item.quantity} {item.unit}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddToPantry(item)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Hinzufügen
                      </Button>
                    </div>
                  ))}
                </div>

                {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      💡 Rezept-Vorschläge:
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <span className="w-2 h-2 bg-primary-600 rounded-full mr-3" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Tipps für bessere Ergebnisse:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Stellen Sie sicher, dass die Lebensmittel gut beleuchtet und sichtbar sind</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Fotografieren Sie die Artikel einzeln oder in kleinen Gruppen für beste Ergebnisse</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Vermeiden Sie verwackelte oder unscharfe Bilder</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Die KI-Erkennung ist eine Schätzung - überprüfen Sie die Ergebnisse vor dem Hinzufügen</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
