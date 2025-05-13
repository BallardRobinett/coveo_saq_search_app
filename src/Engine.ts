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
  const qsModelIDs = {
    'en': 'prftallenzw2b34lf_querysuggest_3ff5c609_b346_4157_88f6_910dd25adbd1',
    'fr': 'prftallenzw2b34lf_querysuggest_ea131008_0e67_4e31_8039_4d98ffa77651',
  };
  const pipelineName = pipelineNames[language as keyof typeof pipelineNames] || pipelineNames['en'];
  const qsModelID = qsModelIDs[language as keyof typeof qsModelIDs] || qsModelIDs['en'];

  const config = {
    organizationId: "prftallenzw2b34lf",
    accessToken: 'xxfa66ef37-9bf1-4633-9a1d-11f07b2f0a4c',
    platformUrl: 'prftallenzw2b34lf.org.coveo.com',
    search: {
      pipeline: pipelineName,
      querySuggest: {
        modelId: qsModelID,
        partialMatch: true,
        enableNavigationalQueries: true,
        enableWordCompletion: true
      }
    }
  };

  console.log(pipelineName)
  console.log(qsModelID)

  const engine = buildSearchEngine({
    configuration: config,
  });

  console.log(config)
  console.log(engine)

  return registerAdditionalFields(engine);
};

headlessEngine = buildEngine('en');

export {headlessEngine};

export const updatePipeline = (language: string): SearchEngine => {
  headlessEngine = buildEngine(language);
  // console.log(headlessEngine)
  return headlessEngine;
};