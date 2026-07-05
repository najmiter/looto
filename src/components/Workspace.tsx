import Preview from './Preview';
import LayersPanel from './LayersPanel';
import Inspector from './Inspector';
import JsonEditor from './JsonEditor';
import ViewToggle, { type EditorView } from './ViewToggle';
import type { LottieAnimation } from '@/types/lottie';
import type { ColorProperty } from '@/types';

interface WorkspaceProps {
  animation: LottieAnimation;
  view: EditorView;
  onViewChange: (view: EditorView) => void;
  layerColors: { [key: number]: ColorProperty[] };
  selectedLayer: number | null;
  onSelectLayer: (index: number | null) => void;
  onDeleteLayer: (index: number) => void;
  onChange: (newData: LottieAnimation) => void;
  jsonString: string;
  jsonError: string;
  onJsonChange: (json: string) => void;
}

export default function Workspace({
  animation,
  view,
  onViewChange,
  layerColors,
  selectedLayer,
  onSelectLayer,
  onDeleteLayer,
  onChange,
  jsonString,
  jsonError,
  onJsonChange,
}: WorkspaceProps) {
  const selectedLayerName =
    selectedLayer !== null ? animation.layers[selectedLayer]?.nm || `Layer ${selectedLayer + 1}` : undefined;

  const preview = (
    <Preview
      lottieData={animation}
      selectedLayer={selectedLayer}
      onSelectLayer={onSelectLayer}
      selectedLayerName={selectedLayerName}
    />
  );

  return (
    <div className="grid gap-4 lg:h-[calc(100dvh-7.5rem)] lg:min-h-[560px] lg:grid-cols-[280px_minmax(0,1fr)_340px]">
      {view === 'design' ? (
        <>
          <div className="order-2 h-96 lg:order-1 lg:h-auto lg:min-h-0">
            <LayersPanel
              animation={animation}
              layerColors={layerColors}
              selectedLayer={selectedLayer}
              onSelect={onSelectLayer}
              onDelete={onDeleteLayer}
            />
          </div>
          <div className="order-1 h-[60vh] lg:order-2 lg:h-auto lg:min-h-0">{preview}</div>
          <div className="order-3 h-[32rem] lg:h-auto lg:min-h-0">
            <Inspector
              animation={animation}
              selectedLayer={selectedLayer}
              layerColors={layerColors}
              onChange={onChange}
            />
          </div>
        </>
      ) : (
        <>
          <div className="order-2 h-[60vh] lg:order-1 lg:col-span-2 lg:h-auto lg:min-h-0">
            <JsonEditor jsonString={jsonString} error={jsonError} onChange={onJsonChange} />
          </div>
          <div className="order-1 h-[50vh] lg:order-2 lg:h-auto lg:min-h-0">{preview}</div>
        </>
      )}

      <div className="order-4 flex justify-center md:hidden">
        <ViewToggle view={view} onChange={onViewChange} />
      </div>
    </div>
  );
}
