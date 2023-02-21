import React, { useContext } from "react";

import { GptContext } from "../context/gptContext";
import { ApiContext } from "../context/apiContext";
import { ImageContext } from "../context/imageContext";

import { ApiKey, AZURE, OPENAI } from "../config";
import { OpenAIApiAdapter } from '../core/apiAdapters/OpenAIApiAdapter';
import { IApiAdapter } from '../core/apiAdapters/IApiAdapter';
import { PowerAppsApiAdapter } from '../core/apiAdapters/PowerAppsApiAdapter';

const adapters = new Map<string, any>();
adapters.set(OPENAI, new OpenAIApiAdapter());
adapters.set(AZURE, new PowerAppsApiAdapter());

export const useGptQuery = () => {
  const gptContext: any = useContext(GptContext);
  const apiContext: any = useContext(ApiContext);
  const imageContext: any = useContext(ImageContext);

  // If this Provider is not injected into this route, this will be an empty object
  if (gptContext === undefined) {
    throw new Error("GptContext was null");
  }

  // If this Provider is not injected into this route, this will be an empty object
  if (apiContext === undefined) {
    throw new Error("ApiContext was null");
  }

  // If this Provider is not injected into this route, this will be an empty object
  if (imageContext === undefined) {
    throw new Error("ImageContext was null");
  }

  // This will do with initializing the list of model sdepending on which API has been set as default
  React.useEffect(() => {
    const apiKey: ApiKey = apiContext.getCurrentApiKey();
    if (apiKey) {
      const adapter: IApiAdapter = adapters.get(apiKey.service);
      gptContext.fetchModels(adapter, apiKey.key, apiKey.modelUrl);
    } else {
      gptContext.setError("Failed to load models. Check API key")
    }
  }, [apiContext.currentApiKeyName])

  // This will combine the API key, service and a Text Prompt execution
  const executeQuery = () => {
    if (Object.keys(gptContext).length === 0) { return; }
    const apiKey: ApiKey = apiContext.getCurrentApiKey();
    const adapter: IApiAdapter = adapters.get(apiKey.service);
    gptContext.executeQuery(adapter, apiKey.key, apiKey.modelUrl);
  }

  // This will combine the API key, service and a Image Prompt execution
  const executeImageQuery = () => {
    if (Object.keys(imageContext).length === 0) { return; }
    const apiKey: ApiKey = apiContext.getCurrentApiKey();
    const adapter: IApiAdapter = adapters.get(apiKey.service);
    imageContext.executeQuery(adapter, apiKey.key, apiKey.modelUrl);
  }

  const fetchModels = () => {
    if (Object.keys(gptContext).length === 0) { return; }
    const apiKey: ApiKey = apiContext.getCurrentApiKey();
    const adapter: IApiAdapter = adapters.get(apiKey.service);
    gptContext.fetchModels(adapter, apiKey.key, apiKey.modelUrl);
  }

  return [executeQuery, executeImageQuery, fetchModels];
};