import React, { useContext } from "react";

import { ApiContext } from "../context/apiContext";
import { FineTunesContext } from "../context/fineTunesContext";

import { ApiKey } from "../config";

export const useGptFineTune = () => {
  const apiContext: any = useContext(ApiContext);
  const fineTunesContext: any = useContext(FineTunesContext);

  // If this Provider is not injected into this route, this will be an empty object
  if (apiContext === undefined) {
    throw new Error("ApiContext was null");
  }

  // If this Provider is not injected into this route, this will be an empty object
  if (fineTunesContext === undefined) {
    throw new Error("FineTunesContext was null");
  }

  // This fetches the initalial set of files and fine-tunes. Failure here means API key is not supported or incorrect
  React.useEffect(() => {
    const apiKey: ApiKey = apiContext.getCurrentApiKey();
    if (apiKey) {
      fineTunesContext.initialize(apiKey.key);
    } else {
      fineTunesContext.setError("Failed to load files or fine-tunes. Check API profile")
    }
    // eslint-disable-next-line
  }, [apiContext.currentApiKeyName])

  return [fineTunesContext];
};