import { 
  buildSearchEngine, 
  getSampleSearchEngineConfiguration,
  loadFieldActions,
  SearchEngine,
  loadSearchConfigurationActions,
} from "@coveo/headless";


const FIELDS = [
  "ec_images",
];

const registerAdditionalFields = (headlessEngine: SearchEngine) => {
  const fieldActions = loadFieldActions(headlessEngine);
  headlessEngine.dispatch(fieldActions.registerFieldsToInclude(FIELDS));
  return headlessEngine;
}

let headlessEngine: SearchEngine;

export const buildEngine = (language: string) => {
  const pipelineNames = {
    'en': 'saq_query_pipeline_en',
    'fr': 'saq_query_pipeline_fr',
  };
  const pipelineName = pipelineNames[language as keyof typeof pipelineNames] || pipelineNames['en'];
  const config = {
    organizationId: "prftallenzw2b34lf",
    accessToken: 'xxfa66ef37-9bf1-4633-9a1d-11f07b2f0a4c',
    platformUrl: 'prftallenzw2b34lf.org.coveo.com',
    search: {
      pipeline: pipelineName,
      locale: language,
    },
  };

  const engine = buildSearchEngine({
    configuration: config,
  });

  return registerAdditionalFields(engine);
};

headlessEngine = buildEngine('en');

export {headlessEngine};

export const updatePipeline = (language: string): SearchEngine => {
  headlessEngine = buildEngine(language);
  return headlessEngine;
};