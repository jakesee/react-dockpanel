# React DockPanel

## Introduction
React panels that can split screen and stack forms.

## Install
`npm i @jakesee/react-dockpanel`

## Usage

```
// Basic test to render the dock manager without any content
import { DockManager, useDockManager } from '@jakesee/react-dockpanel';

const App = () > {
  const manager = useDockManager();

  return (
    <DockManager manager={manager} onRenderForm{() => {} />
  )
}
```
