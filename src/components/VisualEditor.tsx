import React, { useState, useEffect } from 'react';
import type { LottieAnimation } from '../types/lottie';

interface VisualEditorProps {
  lottieData: object | null;
  onChange: (newData: object) => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({
  lottieData,
  onChange,
}) => {
  const [animation, setAnimation] = useState<LottieAnimation | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);

  useEffect(() => {
    if (lottieData) {
      setAnimation(lottieData as LottieAnimation);
    }
  }, [lottieData]);

  const handleLayerDelete = (layerIndex: number) => {
    if (!animation) return;

    const newLayers = animation.layers.filter(
      (_, index) => index !== layerIndex
    );
    const updatedAnimation = { ...animation, layers: newLayers };
    setAnimation(updatedAnimation);
    onChange(updatedAnimation);
    setSelectedLayer(null);
  };

  const handleLayerPropertyChange = (
    layerIndex: number,
    property: string,
    value: any
  ) => {
    if (!animation) return;

    const newLayers = [...animation.layers];
    newLayers[layerIndex] = { ...newLayers[layerIndex], [property]: value };
    const updatedAnimation = { ...animation, layers: newLayers };
    setAnimation(updatedAnimation);
    onChange(updatedAnimation);
  };

  const handleAnimationPropertyChange = (property: string, value: any) => {
    if (!animation) return;

    const updatedAnimation = { ...animation, [property]: value };
    setAnimation(updatedAnimation);
    onChange(updatedAnimation);
  };

  const getLayerTypeName = (type: number) => {
    const layerTypes: { [key: number]: string } = {
      0: 'Precomp',
      1: 'Solid',
      2: 'Image',
      3: 'Null',
      4: 'Shape',
      5: 'Text',
    };
    return layerTypes[type] || `Type ${type}`;
  };

  if (!animation) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          No Lottie animation loaded. Please upload a file first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Visual Lottie Editor
        </h3>
      </div>

      <div className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          Animation Properties
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={animation.nm || ''}
              onChange={(e) =>
                handleAnimationPropertyChange('nm', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frame Rate
            </label>
            <input
              type="number"
              value={animation.fr}
              onChange={(e) =>
                handleAnimationPropertyChange('fr', parseFloat(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Width
            </label>
            <input
              type="number"
              value={animation.w}
              onChange={(e) =>
                handleAnimationPropertyChange('w', parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Height
            </label>
            <input
              type="number"
              value={animation.h}
              onChange={(e) =>
                handleAnimationPropertyChange('h', parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          Layers ({animation.layers.length})
        </h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {animation.layers.map((layer, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-dark-800 rounded-lg border transition-colors ${
                selectedLayer === index
                  ? 'border-violet-500 shadow-md'
                  : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
              }`}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() =>
                  setSelectedLayer(selectedLayer === index ? null : index)
                }
              >
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200">
                    {getLayerTypeName(layer.ty)}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {layer.nm || `Layer ${index + 1}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLayerDelete(index);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      selectedLayer === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {selectedLayer === index && (
                <div className="border-t border-gray-200 dark:border-dark-600 p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={layer.nm || ''}
                        onChange={(e) =>
                          handleLayerPropertyChange(index, 'nm', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        In Point
                      </label>
                      <input
                        type="number"
                        value={layer.ip}
                        onChange={(e) =>
                          handleLayerPropertyChange(
                            index,
                            'ip',
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Out Point
                      </label>
                      <input
                        type="number"
                        value={layer.op}
                        onChange={(e) =>
                          handleLayerPropertyChange(
                            index,
                            'op',
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Time
                      </label>
                      <input
                        type="number"
                        value={layer.st}
                        onChange={(e) =>
                          handleLayerPropertyChange(
                            index,
                            'st',
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {layer.ks && (
                    <div className="pt-4 border-t border-gray-200 dark:border-dark-600">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Transform
                      </h5>

                      {layer.ks.p && Array.isArray(layer.ks.p.k) && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Position X
                            </label>
                            <input
                              type="number"
                              value={layer.ks.p.k[0] || 0}
                              onChange={(e) => {
                                const newPos = [...(layer.ks.p.k as number[])];
                                newPos[0] = parseFloat(e.target.value);
                                const newKs = {
                                  ...layer.ks,
                                  p: { ...layer.ks.p, k: newPos },
                                };
                                handleLayerPropertyChange(index, 'ks', newKs);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Position Y
                            </label>
                            <input
                              type="number"
                              value={layer.ks.p.k[1] || 0}
                              onChange={(e) => {
                                const newPos = [...(layer.ks.p.k as number[])];
                                newPos[1] = parseFloat(e.target.value);
                                const newKs = {
                                  ...layer.ks,
                                  p: { ...layer.ks.p, k: newPos },
                                };
                                handleLayerPropertyChange(index, 'ks', newKs);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}

                      {layer.ks.s && Array.isArray(layer.ks.s.k) && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Scale X
                            </label>
                            <input
                              type="number"
                              value={layer.ks.s.k[0] || 100}
                              onChange={(e) => {
                                const newScale = [
                                  ...(layer.ks.s.k as number[]),
                                ];
                                newScale[0] = parseFloat(e.target.value);
                                const newKs = {
                                  ...layer.ks,
                                  s: { ...layer.ks.s, k: newScale },
                                };
                                handleLayerPropertyChange(index, 'ks', newKs);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Scale Y
                            </label>
                            <input
                              type="number"
                              value={layer.ks.s.k[1] || 100}
                              onChange={(e) => {
                                const newScale = [
                                  ...(layer.ks.s.k as number[]),
                                ];
                                newScale[1] = parseFloat(e.target.value);
                                const newKs = {
                                  ...layer.ks,
                                  s: { ...layer.ks.s, k: newScale },
                                };
                                handleLayerPropertyChange(index, 'ks', newKs);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;
