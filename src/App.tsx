import { useRef } from "react";
import { Draggable, Droppable, Movable } from "./components/Draggable";
import { GlobalStyle } from "./GlobalStyle";
import styled from 'styled-components';
import { height } from "@mui/system";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: min-content 1fr;
  gap: 2px;

  background-color: #ccc;
  padding: 2px;

  box-shadow: 2px 2px 2px #888;
`

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-items: flex-start;
  background-color: #336699;
  padding: 2px 4px;
  color: #fff;

  cursor: pointer;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  height: 100%;

  background-color: #fff;

  div {
    flex: 1 1 auto;

    text-align: center;
  }
`;


const Panel = ({ title}: { title: string }) => {

  const elementRef = useRef<HTMLDivElement>(null);
  const movable = new Movable(() => elementRef.current);
  const draggable = new Draggable(() => elementRef.current);

  return (
    <Wrapper ref={elementRef}>
      <TitleBar
        // onMouseDown={(e) => movable.onMouseDown(e.nativeEvent)}
        // onMouseMove={(e) => movable.onMouseMove(e.nativeEvent)}
        // onMouseUp={(e) => movable.onMouseUp(e.nativeEvent)}

        // onTouchStart={(e) => movable.onTouchStart(e.nativeEvent)}
        // onTouchMove={(e) => movable.onTouchMove(e.nativeEvent)}
        // onTouchEnd={(e) => movable.onTouchEnd(e.nativeEvent)}

        onDragStart={(e) => draggable.onDragStart(e.nativeEvent, () => '')}

        draggable
      >
        {title}
      </TitleBar>
      <Content>
        <div>the contents</div>
      </Content>
    </Wrapper>
  )
}

const DockHost = (props: any) => {

  const elementRef = useRef(null);
  const droppable = new Droppable(() => elementRef.current);

  return (
    <div
      ref={elementRef}
      onDrop={(e) => droppable.onDrop(e.nativeEvent)}
      onDragOver={(e) => droppable.onDragOver(e.nativeEvent, () => true)}
      style={
        {
          border: '1px solid red',
          display: "inline-block",
        }
      }>
      {props.children}
    </div>
  )
}


function App() {




  return (
    <>
    <GlobalStyle />
      <DockHost>1<Panel title="Properties Panel" /></DockHost>
      <DockHost>2<Panel title="Error List" /></DockHost>
      <DockHost>3</DockHost>
      <DockHost>4<Panel title="Toolbox" /></DockHost>
      <DockHost>5</DockHost>
      <DockHost>6</DockHost>
      <DockHost>7</DockHost>
    </>
  );
}

export default App;
