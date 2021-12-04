# Dock Panel Suite

## Introduction
React panels that can split screen and stack forms.

## Install
`npm i dock-panel-suite`

## Usage

```
// Basic test to render the dock manager without any content
const App = () > {
  const manager = useDockManager();

  return (
    <DockManager manager={manager} onRenderForm{() => {} />
  )
}
```
