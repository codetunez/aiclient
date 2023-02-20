import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { GptProvider } from './context/gptContext';
import { FineTunesProvider } from './context/fineTunesContext';
import { ImageProvider } from './context/imageContext';

import './index.css';

import Prompts from './pages/prompts/prompts';
import FineTunes from './pages/fineTunes/fineTunes';
import ApiKeys from './pages/apiKeys/apiKeys';
import Images from './pages/images/images';

const router = createBrowserRouter([
  {
    path: "/",
    element: <GptProvider><Prompts /></GptProvider>
  },
  {
    path: "images",
    element: <GptProvider><ImageProvider><Images /></ImageProvider></GptProvider>
  },
  {
    path: "finetunes",
    element: <FineTunesProvider><FineTunes /></FineTunesProvider>
  },
  {
    path: "apikeys",
    element: <GptProvider><ApiKeys /></GptProvider>
  }
]
);

const root = ReactDOM.createRoot(document.getElementById('root') as any);
root.render(<RouterProvider router={router} />);