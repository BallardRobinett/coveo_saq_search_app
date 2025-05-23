import {
  buildSearchBox,
  buildResultList,
  buildFacet,
  buildSort,
  buildPager,
  buildResultTemplatesManager,
  SearchEngine,
  buildNumericFacet,
  NumericFacet
} from "@coveo/headless";
import { criteria } from "../components/Sort";
import { headlessEngine } from "../Engine";
import { buildResultTemplatesManagerWithEngine } from "./ResultTemplatesManager";

export interface Controllers {
  pager: ReturnType<typeof buildPager>;
  searchBox: ReturnType<typeof buildSearchBox>;
  numericFacet: NumericFacet;
  priceFacet: NumericFacet;
  resultList: ReturnType<typeof buildResultList>;
  sort: ReturnType<typeof buildSort>;
  resultTemplatesManager: ReturnType<typeof buildResultTemplatesManagerWithEngine>;
}

export const buildControllers = (engine: SearchEngine): Controllers => {
  return {
    pager: buildPager(engine),
    searchBox: buildSearchBox(engine, {
      options: {
        highlightOptions: {
          notMatchDelimiters: {
            open: '<strong>',
            close: '</strong>',
          },
          correctionDelimiters: {
            open: '<i>',
            close: '</i>',
          },
        },
      },
    }),
    numericFacet: buildNumericFacet(engine, {
      options: { 
        field: 'product_availability',
        generateAutomaticRanges: false,
        sortCriteria: 'ascending',
        numberOfValues: 5,
        currentValues: [
          {
            start: 1,
            end: 10,
            endInclusive: true,
            state: 'idle'
          },
          {
            start: 10,
            end: 50,
            endInclusive: true,
            state: 'idle'
          },
          {
            start: 50,
            end: 100,
            endInclusive: true,
            state: 'idle'
          },
          {
            start: 100,
            end: 10000,
            endInclusive: true,
            state: 'idle'
          },
        ]
      }
    }),
    priceFacet: buildNumericFacet(engine, {
      options: { 
        field: 'ec_price',
        generateAutomaticRanges: false,
        sortCriteria: 'ascending',
        numberOfValues: 5,
        currentValues: [
          {
            start: 0,
            end: 25,
            endInclusive: true,
            state: 'idle'
          },
          {
            start: 25,
            end: 50,
            endInclusive: true,
            state: 'idle'
          },
          {
            start: 50,
            end: 100,
            endInclusive: true,
            state: 'idle'
          },
          {
            start: 100,
            end: 200,
            endInclusive: true,
            state: 'idle'
          },
          {
            start: 200,
            end: 400,
            endInclusive: true,
            state: 'idle'
          },
          {
            start: 400,
            end: 5000,
            endInclusive: true,
            state: 'idle'
          },
        ]
      }
    }),
    resultList: buildResultList(engine),
    sort: buildSort(engine, {
      initialState: { criterion: criteria[0][1] },
    }),
    resultTemplatesManager: buildResultTemplatesManagerWithEngine(engine),
  };
};

const initialControllers = buildControllers(headlessEngine);

export const pager = initialControllers.pager;
export const searchBox = initialControllers.searchBox;
export const numericFacet = initialControllers.numericFacet;
export const priceFacet = initialControllers.priceFacet;
export const resultList = initialControllers.resultList;
export const sort = initialControllers.sort;
export const resultTemplatesManager = initialControllers.resultTemplatesManager;