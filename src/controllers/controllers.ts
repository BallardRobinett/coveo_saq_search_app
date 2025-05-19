import {
  buildSearchBox,
  buildResultList,
  buildFacet,
  buildSort,
  buildPager,
  buildResultTemplatesManager,
  SearchEngine,
  buildNumericFacet
} from "@coveo/headless";
import { criteria } from "../components/Sort";
import { headlessEngine } from "../Engine";
import { buildResultTemplatesManagerWithEngine } from "./ResultTemplatesManager";

export const buildControllers = (engine: SearchEngine) => {
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
    facet: buildFacet(engine, {
      options: { field: 'source' }
    }),
    availabilityFacet: buildNumericFacet(engine, {
      options: { 
        field: 'product_availability',
        generateAutomaticRanges: false,
        currentValues: [
          {
            start: 1,
            end: Number.POSITIVE_INFINITY,
            endInclusive: true,
            state: 'idle',
          },
          {
            start: 0,
            end: 0,
            endInclusive: true,
            state: 'idle',
          }
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
export const facet = initialControllers.facet;
export const availabilityFacet = initialControllers.availabilityFacet;
export const resultList = initialControllers.resultList;
export const sort = initialControllers.sort;
export const resultTemplatesManager = initialControllers.resultTemplatesManager;