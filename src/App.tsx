import { createStore, Provider } from "jotai";
import { Toaster } from "sonner";

import BlockNotePage from "./pages/BlockNotePage";

const customStore = createStore();

function App() {
  return (
    <>
      <Provider store={customStore}>
        <BlockNotePage />
        <Toaster position="top-right" />
      </Provider>
    </>
  );
}

export default App;
