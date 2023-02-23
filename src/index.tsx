import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { GptProvider } from './context/gptContext';
import { FineTunesProvider } from './context/fineTunesContext';
import { ImageProvider } from './context/imageContext';
import { ApiProvider } from './context/apiContext';

import './index.css';

import Prompts from './pages/prompts/prompts';
import FineTunes from './pages/fineTunes/fineTunes';
import ApiKeys from './pages/apiKeys/apiKeys';
import Images from './pages/images/images';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ApiProvider><GptProvider><Prompts /></GptProvider></ApiProvider>
  },
  {
    path: "images",
    element: <ApiProvider><GptProvider><ImageProvider><Images /></ImageProvider></GptProvider></ApiProvider>
  },
  {
    path: "finetunes",
    element: <ApiProvider><FineTunesProvider><FineTunes /></FineTunesProvider></ApiProvider>
  },
  {
    path: "apikeys",
    element: <ApiProvider><ApiKeys /></ApiProvider>
  }
]
);

const root = ReactDOM.createRoot(document.getElementById('root') as any);
root.render(<RouterProvider router={router} />);