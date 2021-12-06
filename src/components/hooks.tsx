import { useRef, useState } from 'react';
import { CDockForm, CDockLayoutItem, CDockPanel, CDockSplitter, DockLayoutItemType, DockPosition, IDockManager } from './interface';

export const useDockManager = (): IDockManager => {
  const counter = useRef(0);

  const _hash = (prefix: string) => {
    return `${prefix}-${++counter.current}`;
  };

  const clone = (layout: CDockLayoutItem) => {
    return JSON.parse(JSON.stringify(layout));
  };

  const createForm = (name: string) => {
    return new CDockForm(_hash('dmf'), name);
  };

  const createPanel = (forms: CDockForm[]) => {
    return new CDockPanel(_hash('dmp'), forms);
  };

  const createSplitter = (primary: CDockLayoutItem, secondary: CDockLayoutItem, isVertical: boolean = false, size: number = 50) => {
    return new CDockSplitter(_hash('dms'), primary, secondary, isVertical, size);
  };

  const [layout, setLayout] = useState<CDockLayoutItem>(createPanel([]));

  const dock = (formId: string, panelId: string, position: DockPosition) => {
    if (position === DockPosition.Center) {
      stack(formId, panelId);
    } else {
      split(formId, panelId, position);
    }
  };

  const split = (formId: string, destPanelId: string, position: DockPosition) => {
    setLayout(layout => {
      // find the form and its panel
      const { form, panel } = _findForm(layout, formId);

      if (form && panel) {
        if (panel.id === destPanelId && panel.forms.length <= 1) {
          console.log('cannot split a panel with only 1 form');
          return layout; // do nothing
        } else {
          // remove form from panel
          const index = panel.forms.findIndex(f => f.id === formId);
          panel.forms.splice(index, 1);
          panel.activeIndex = Math.min(panel.forms.length - 1, panel.activeIndex);

          // find the destination panel
          const { found: destPanel, parent } = _findLayoutItem(layout, destPanelId, null);
          if (destPanel) {
            // prepare a new splitter with both the old and new panel
            const newPanel = createPanel([form]);
            let newSplitter: CDockSplitter;
            switch (position) {
              case DockPosition.Left:
                newSplitter = createSplitter(newPanel, destPanel, false);
                break;
              case DockPosition.Top:
                newSplitter = createSplitter(newPanel, destPanel, true);
                break;
              case DockPosition.Bottom:
                newSplitter = createSplitter(destPanel, newPanel, true);
                break;
              default:
                newSplitter = createSplitter(destPanel, newPanel, false);
                break;
            }

            // check where is the original location of the destination panel
            // and insert the new splitter at the location
            if (parent) {
              if (parent.primary.id === destPanel.id) {
                parent.primary = newSplitter;
              } else if (parent.secondary.id === destPanel.id) {
                parent.secondary = newSplitter;
              }
            } else {
              layout = newSplitter;
            }
          }

          layout = _occupyFreeSpace(layout, layout);
        }
      }

      return { ...layout };
    });
  };

  const stack = (formId: string, panelId: string) => {
    setLayout(prev => {
      // extract the form
      const { form, panel } = _findForm(layout, formId);
      if (form && panel) {
        // remove form from panel
        const index = panel.forms.findIndex(f => f.id === formId);
        panel.forms.splice(index, 1);
        panel.activeIndex = Math.min(panel.forms.length - 1, panel.activeIndex);
      }

      // put the form into the destination panel
      const { found: destination } = _findLayoutItem(prev, panelId, null);
      if (form && destination) {
        // add form to destination panel
        const panel = destination as CDockPanel;
        panel.forms.push(form);
        panel.activeIndex = panel.forms.length - 1; // the last form in the array

        prev = _occupyFreeSpace(layout, layout);
      }

      return { ...prev };
    });
  };

  const remove = (formId: string) => {
    setLayout(layout => {
      const { form, panel } = _findForm(layout, formId);
      if (form && panel) {
        const index = panel.forms.findIndex(f => f.id === formId);
        panel.forms.splice(index, 1);
      }

      return { ...layout };
    });
  };

  const activate = (panelId: string, activeIndex: number) => {
    setLayout(layout => {
      const { found } = _findLayoutItem(layout, panelId, null);
      if (found) {
        const panel = found as CDockPanel;
        panel.activeIndex = activeIndex;
      }

      return { ...layout };
    });
  };

  const _occupyFreeSpace = (root: CDockLayoutItem, start: CDockLayoutItem) => {
    if (start.type === DockLayoutItemType.Splitter) {
      const splitter = start as CDockSplitter;
      if (splitter.primary.type === DockLayoutItemType.Splitter) {
        _occupyFreeSpace(root, splitter.primary);
      }

      if (splitter.secondary.type === DockLayoutItemType.Splitter) {
        _occupyFreeSpace(root, splitter.secondary);
      }

      if (splitter.primary.type === DockLayoutItemType.Panel) {
        const panel1 = splitter.primary as CDockPanel;
        if (panel1.forms.length === 0) {
          return _replace(root, splitter, splitter.secondary as CDockPanel);
        }
      }

      if (splitter.secondary.type === DockLayoutItemType.Panel) {
        const panel2 = splitter.secondary as CDockPanel;
        if (panel2.forms.length === 0) {
          return _replace(root, splitter, splitter.primary as CDockPanel);
        }
      }
    }

    return root;
  };

  const _replace = (root: CDockLayoutItem, oldItem: CDockSplitter, newItem: CDockPanel): CDockLayoutItem => {
    const { found, parent } = _findLayoutItem(root, oldItem.id, null);
    if (found && parent) {
      if (found.id === parent.primary.id) {
        parent.primary = newItem;
      } else if (found.id === parent.secondary.id) {
        parent.secondary = newItem;
      }

      return root;
    } else {
      return newItem;
    }
  };

  const _findForm = (layoutItem: CDockLayoutItem, formId: string): { form: CDockForm | null; panel: CDockPanel | null } => {
    if (layoutItem.type === DockLayoutItemType.Panel) {
      const panel = layoutItem as CDockPanel;
      const form = panel.forms.find(f => f.id === formId);
      if (form) return { form, panel };
      else return { form: null, panel: null };
    } else if (layoutItem.type === DockLayoutItemType.Splitter) {
      const splitter = layoutItem as CDockSplitter;
      const { form, panel } = _findForm(splitter.primary, formId);
      if (Boolean(form)) {
        return { form, panel };
      } else {
        const { form, panel } = _findForm(splitter.secondary, formId);
        if (Boolean(form)) {
          return { form, panel };
        }
      }
    }

    return { form: null, panel: null };
  };

  const _findLayoutItem = (
    layoutItem: CDockLayoutItem,
    searchId: string,
    parent: CDockSplitter | null
  ): { found: CDockLayoutItem | null; parent: CDockSplitter | null } => {
    if (searchId === layoutItem.id) {
      // found!
      return { found: layoutItem, parent };
    } else if (layoutItem.type === DockLayoutItemType.Splitter) {
      const splitter = layoutItem as CDockSplitter;
      const { found, parent } = _findLayoutItem(splitter.primary, searchId, splitter);
      if (Boolean(found)) {
        return { found, parent };
      } else {
        const { found, parent } = _findLayoutItem(splitter.secondary, searchId, splitter);
        if (Boolean(found)) {
          return { found, parent };
        }
      }
    }
    return { found: null, parent: null };
  };

  return {
    layout,
    setLayout,
    clone,
    createForm,
    createPanel,
    createSplitter,
    dock,
    remove,
    activate,
  };
};
