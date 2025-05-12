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

const organizationConfig = {
  organizationId: "prftallenzw2b34lf",
  accessToken: 'xxfa66ef37-9bf1-4633-9a1d-11f07b2f0a4c',
  platformUrl: 'prftallenzw2b34lf.org.coveo.com',
  search: {
    pipeline: "saq_query_pipeline_en"
  }
};

const registerAdditionalFields = (headlessEngine: SearchEngine) => {
  const fieldActions = loadFieldActions(headlessEngine);
  headlessEngine.dispatch(fieldActions.registerFieldsToInclude(FIELDS));
  return headlessEngine;
}

const buildEngine = buildSearchEngine({
  configuration: organizationConfig,
});

export const headlessEngine = registerAdditionalFields(buildEngine);

export const updatePipeline = (language: string) => {
  const pipelineNames = {
    'en': 'saq_query_pipeline_en',
    'fr': 'saq_query_pipeline_fr',
  };

  const pipelineName = pipelineNames[language as keyof typeof pipelineNames] || pipelineNames['en'];
  const configActions = loadSearchConfigurationActions(headlessEngine)

  headlessEngine.dispatch(configActions.updateSearchConfiguration({
    pipeline: pipelineName
  }));

  headlessEngine.executeFirstSearch();
};