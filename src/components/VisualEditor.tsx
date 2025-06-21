import React, { useState, useEffect } from 'react';
import type { LottieAnimation } from '../types/lottie';
import './VisualEditor.css';

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
      <div className="visual-editor">
        <p>No Lottie animation loaded. Please upload a file first.</p>
      </div>
    );
  }

  return (
    <div className="visual-editor">
      <h2>Visual Lottie Editor</h2>

      {/* Animation Properties */}
      <div className="animation-properties">
        <h3>Animation Properties</h3>
        <div className="property-group">
          <label>
            Name:
            <input
              type="text"
              value={animation.nm || ''}
              onChange={(e) =>
                handleAnimationPropertyChange('nm', e.target.value)
              }
            />
          </label>
          <label>
            Frame Rate:
            <input
              type="number"
              value={animation.fr}
              onChange={(e) =>
                handleAnimationPropertyChange('fr', parseFloat(e.target.value))
              }
            />
          </label>
          <label>
            Width:
            <input
              type="number"
              value={animation.w}
              onChange={(e) =>
                handleAnimationPropertyChange('w', parseInt(e.target.value))
              }
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              value={animation.h}
              onChange={(e) =>
                handleAnimationPropertyChange('h', parseInt(e.target.value))
              }
            />
          </label>
        </div>
      </div>

      {/* Layers List */}
      <div className="layers-section">
        <h3>Layers ({animation.layers.length})</h3>
        <div className="layers-list">
          {animation.layers.map((layer, index) => (
            <div
              key={index}
              className={`layer-item ${selectedLayer === index ? 'selected' : ''}`}
              onClick={() =>
                setSelectedLayer(selectedLayer === index ? null : index)
              }
            >
              <div className="layer-header">
                <span className="layer-type">{getLayerTypeName(layer.ty)}</span>
                <span className="layer-name">
                  {layer.nm || `Layer ${index + 1}`}
                </span>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLayerDelete(index);
                  }}
                >
                  ×
                </button>
              </div>

              {selectedLayer === index && (
                <div className="layer-properties">
                  <div className="property-group">
                    <label>
                      Name:
                      <input
                        type="text"
                        value={layer.nm || ''}
                        onChange={(e) =>
                          handleLayerPropertyChange(index, 'nm', e.target.value)
                        }
                      />
                    </label>
                    <label>
                      In Point:
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
                      />
                    </label>
                    <label>
                      Out Point:
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
                      />
                    </label>
                    <label>
                      Start Time:
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
                      />
                    </label>
                  </div>

                  {/* Transform Properties */}
                  {layer.ks && (
                    <div className="transform-properties">
                      <h4>Transform</h4>
                      {layer.ks.p && Array.isArray(layer.ks.p.k) && (
                        <div className="position-controls">
                          <label>Position X:</label>
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
                          />
                          <label>Position Y:</label>
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
                          />
                        </div>
                      )}

                      {layer.ks.s && Array.isArray(layer.ks.s.k) && (
                        <div className="scale-controls">
                          <label>Scale X:</label>
                          <input
                            type="number"
                            value={layer.ks.s.k[0] || 100}
                            onChange={(e) => {
                              const newScale = [...(layer.ks.s.k as number[])];
                              newScale[0] = parseFloat(e.target.value);
                              const newKs = {
                                ...layer.ks,
                                s: { ...layer.ks.s, k: newScale },
                              };
                              handleLayerPropertyChange(index, 'ks', newKs);
                            }}
                          />
                          <label>Scale Y:</label>
                          <input
                            type="number"
                            value={layer.ks.s.k[1] || 100}
                            onChange={(e) => {
                              const newScale = [...(layer.ks.s.k as number[])];
                              newScale[1] = parseFloat(e.target.value);
                              const newKs = {
                                ...layer.ks,
                                s: { ...layer.ks.s, k: newScale },
                              };
                              handleLayerPropertyChange(index, 'ks', newKs);
                            }}
                          />
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
