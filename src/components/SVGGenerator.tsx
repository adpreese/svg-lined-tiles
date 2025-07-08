import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw } from 'lucide-react';
import { ColorInput } from './ColorInput';
import { generateSVG } from '../utils/svgGenerator';

interface SVGParameters {
  height: number;
  width: number;
  verticalLines: number;
  horizontalLines: number;
  avgStrokeWidth: number;
  avgOpacity: number;
  backgroundColor: string;
  lineColors: string[];
}

const defaultParams: SVGParameters = {
  height: 400,
  width: 400,
  verticalLines: 18,
  horizontalLines: 12,
  avgStrokeWidth: 1.0,
  avgOpacity: 0.65,
  backgroundColor: '#5e666e',
  lineColors: ['#ce8e3b', '#d1d9ff', '#d1cbc7', '#000000']
};

export const SVGGenerator: React.FC = () => {
  const [params, setParams] = useState<SVGParameters>(defaultParams);
  const [svgContent, setSvgContent] = useState<string>('');

  const generateArt = useCallback(() => {
    console.log('Generating SVG with params:', params);
    const newSvg = generateSVG(params);
    setSvgContent(newSvg);
  }, [params]);

  React.useEffect(() => {
    generateArt();
  }, [generateArt]);

  const updateParam = <K extends keyof SVGParameters>(key: K, value: SVGParameters[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const addColor = () => {
    setParams(prev => ({
      ...prev,
      lineColors: [...prev.lineColors, '#000000']
    }));
  };

  const updateColor = (index: number, color: string) => {
    setParams(prev => ({
      ...prev,
      lineColors: prev.lineColors.map((c, i) => i === index ? color : c)
    }));
  };

  const removeColor = (index: number) => {
    if (params.lineColors.length > 1) {
      setParams(prev => ({
        ...prev,
        lineColors: prev.lineColors.filter((_, i) => i !== index)
      }));
    }
  };

  const downloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-art.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-6">
      {/* Controls Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height" className="text-sm font-medium">Height</Label>
              <Input
                id="height"
                type="number"
                value={params.height}
                onChange={(e) => updateParam('height', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="width" className="text-sm font-medium">Width</Label>
              <Input
                id="width"
                type="number"
                value={params.width}
                onChange={(e) => updateParam('width', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Line Counts */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="verticalLines" className="text-sm font-medium">Vertical Lines</Label>
              <Input
                id="verticalLines"
                type="number"
                value={params.verticalLines}
                onChange={(e) => updateParam('verticalLines', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="horizontalLines" className="text-sm font-medium">Horizontal Lines</Label>
              <Input
                id="horizontalLines"
                type="number"
                value={params.horizontalLines}
                onChange={(e) => updateParam('horizontalLines', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Stroke and Opacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="avgStrokeWidth" className="text-sm font-medium">Average Stroke Width</Label>
              <Input
                id="avgStrokeWidth"
                type="number"
                step="0.1"
                value={params.avgStrokeWidth}
                onChange={(e) => updateParam('avgStrokeWidth', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="avgOpacity" className="text-sm font-medium">Average Opacity</Label>
              <Input
                id="avgOpacity"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={params.avgOpacity}
                onChange={(e) => updateParam('avgOpacity', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <Label className="text-sm font-medium">Background Color</Label>
            <ColorInput
              value={params.backgroundColor}
              onChange={(color) => updateParam('backgroundColor', color)}
              className="mt-1"
            />
          </div>

          {/* Line Colors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Line Colors</Label>
              <Button onClick={addColor} size="sm" variant="outline">
                Add Color
              </Button>
            </div>
            <div className="space-y-2">
              {params.lineColors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ColorInput
                    value={color}
                    onChange={(newColor) => updateColor(index, newColor)}
                  />
                  <Button
                    onClick={() => removeColor(index)}
                    size="sm"
                    variant="outline"
                    disabled={params.lineColors.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
          <Button onClick={generateArt} className="flex-1 min-w-0" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
          <Button onClick={downloadSVG} className="flex-1 min-w-[140px]">
            <Download className="w-4 h-4 mr-2" />
            Download SVG
          </Button>
        </div>
        </CardContent>
      </Card>

      {/* Preview Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="w-full border rounded-lg overflow-hidden bg-white shadow-inner"

          >
            <div className="w-full flex items-center justify-center p-4">
              {svgContent && (
                <div 
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-full [&>svg]:max-h-[500px]"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
