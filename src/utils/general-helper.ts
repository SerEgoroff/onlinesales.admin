import { RequestContextType } from "@providers/request-provider";
import { continentListStorageKey, countryListStorageKey } from "./constants";

export const getCountryList = async (context: RequestContextType) => {
  const countries = localStorage.getItem(countryListStorageKey);
  if (countries) {
    return JSON.parse(countries) as Record<string, string>;
  } else {
    try {
      const { data } = await context.client.api.countriesList();
      localStorage.setItem(countryListStorageKey, JSON.stringify(data));
      return data;
    } catch (e) {
      return null;
    }
  }
};

export const getCountryByCode = async (context: RequestContextType, code: string) => {
  const countries = await getCountryList(context);
  if (countries) {
    const countryList = Object.entries(countries).map(([code, name]) => ({ code, name }));
    return countryList.find((c) => c.code === code)!.name;
  } else {
    return null;
  }
};

export const getContinentList = async (context: RequestContextType) => {
  const continents = localStorage.getItem(continentListStorageKey);
  if (continents) {
    return JSON.parse(continents) as Record<string, string>;
  } else {
    try {
      const { data } = await context.client.api.continentsList();
      localStorage.setItem(continentListStorageKey, JSON.stringify(data));
      return data;
    } catch (e) {
      return null;
    }
  }
};

export const getContinentByCode = async (context: RequestContextType, code: string) => {
  const continents = await getContinentList(context);
  if (continents) {
    const continentList = Object.entries(continents).map(([code, name]) => ({ code, name }));
    return continentList.find((c) => c.code === code)!.name;
  } else {
    return null;
  }
};

export const getFormattedDateTime = (dateToConvert: string) => {
  const date = new Date(dateToConvert);
  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  const formattedDateTime = `${formattedDate}  ${formattedTime}`;
  return formattedDateTime;
};

export const networkErrorToStringArray = (error: any) => {
  if (error === undefined || error === null) {
    return [];
  }
  const output: string[] = [];
  const keys = Object.keys(error);
  const values = Object.values(error);
  keys.map((key, idx) => {
    const value = values[idx] as string[];
    const stringValue = value.reduce((acc, val) => {
      return `${acc}\u000A${val}`;
    });
    output.push(`${key}:\u000A${stringValue}`);
  });
  return output;
};