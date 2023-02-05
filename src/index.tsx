import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { GptProvider } from './context/gptContext';
import { FineTunesProvider } from './context/fineTunesContext';

import './index.css';

import Shell from './shell';
import ShellFinetunes from './shellFinetunes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <GptProvider><Shell /></GptProvider>
  },
  {
    path: "finetunes",
    element: <FineTunesProvider><ShellFinetunes /></FineTunesProvider>
  }
]
);

const root = ReactDOM.createRoot(document.getElementById('root') as any);
root.render(<RouterProvider router={router} />);