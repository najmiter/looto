import { useMemo, useState } from 'react';
import { validateLottie } from '@/utils/lottieValidator';
import { handleError } from '@/utils/errorHandler';
import { writeLottieFile } from '@/utils/fileHandler';
import { extractColorsFromLayer } from '@/utils/colorUtils';
import type { LottieAnimation } from '@/types/lottie';
import type { ColorProperty } from '@/types';

// owns the document state: the animation data, its JSON text mirror,
// the pristine copy for revert, and every mutation that touches them
export function useLottieDocument() {
  const [lottieData, setLottieData] = useState<LottieAnimation | null>(null);
  const [originalJson, setOriginalJson] = useState<string | null>(null);
  const [jsonString, setJsonString] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('animation.json');
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  const layerColors = useMemo(() => {
    const colors: { [key: number]: ColorProperty[] } = {};
    lottieData?.layers?.forEach((layer, index) => {
      colors[index] = extractColorsFromLayer(layer);
    });
    return colors;
  }, [lottieData]);

  const loadDocument = (jsonData: object, uploadedFileName?: string) => {
    const validationResult = validateLottie(jsonData);
    if (!validationResult.isValid) {
      const message = validationResult.errors.join(', ');
      handleError(message);
      setError(message);
      return;
    }
    const animation = jsonData as LottieAnimation;
    const json = JSON.stringify(animation, null, 2);
    setLottieData(animation);
    setOriginalJson(json);
    setJsonString(json);
    if (uploadedFileName) setFileName(uploadedFileName);
    setSelectedLayer(null);
    setError('');
    setJsonError('');
  };

  const updateDocument = (newData: LottieAnimation) => {
    setLottieData(newData);
    setJsonString(JSON.stringify(newData, null, 2));
    setJsonError('');
  };

  const updateJsonString = (newJsonString: string) => {
    setJsonString(newJsonString);
    try {
      const parsedData = JSON.parse(newJsonString);
      const validationResult = validateLottie(parsedData);
      if (validationResult.isValid) {
        setLottieData(parsedData);
        setJsonError('');
      } else {
        setJsonError(validationResult.errors.join(', '));
      }
    } catch {
      setJsonError('Invalid JSON format');
    }
  };

  const deleteLayer = (layerIndex: number) => {
    if (!lottieData) return;

    const removed = lottieData.layers[layerIndex];
    // layers referencing the removed layer via parent would point at a
    // missing index and crash strict players — reparent them to the removed
    // layer's own parent (or detach them)
    const newLayers = lottieData.layers
      .filter((_, index) => index !== layerIndex)
      .map((layer) => {
        if (removed.ind === undefined || layer.parent !== removed.ind) {
          return layer;
        }
        const { parent: _parent, ...rest } = layer;
        return removed.parent !== undefined ? { ...rest, parent: removed.parent } : rest;
      });

    updateDocument({ ...lottieData, layers: newLayers });
    setSelectedLayer(null);
  };

  const revert = () => {
    if (originalJson === null) return;
    updateDocument(JSON.parse(originalJson));
    setSelectedLayer(null);
  };

  const download = async () => {
    if (!lottieData) return;
    try {
      await writeLottieFile(lottieData, fileName.endsWith('.json') ? fileName : `${fileName}.json`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save file';
      handleError(message);
      setError(message);
    }
  };

  const isDirty = originalJson !== null && jsonString !== originalJson;

  return {
    lottieData,
    jsonString,
    jsonError,
    error,
    setError,
    fileName,
    setFileName,
    selectedLayer,
    setSelectedLayer,
    layerColors,
    isDirty,
    loadDocument,
    updateDocument,
    updateJsonString,
    deleteLayer,
    revert,
    download,
  };
}
