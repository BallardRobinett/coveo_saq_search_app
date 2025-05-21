import { useState, useEffect, FunctionComponent } from "react";
import {
  Result,
  ResultList as ResultListController,
  ResultTemplatesManager
} from "@coveo/headless";
import { AppLanguage } from "../App";

interface ResultListProps {
  controller: ResultListController;
  resultTemplatesManager: ResultTemplatesManager<
    (result: Result, language: AppLanguage) => JSX.Element
  >;
  language: AppLanguage;
}

const ResultList: FunctionComponent<ResultListProps> = (props) => {
  const {controller, resultTemplatesManager} = props;


  const [state, setState] = useState(controller.state);

  useEffect(() => controller.subscribe(() => setState(controller.state)), [
    controller,
  ]);

  if (!state.results.length) {
    return <div>No results</div>;
  }

  return (
    <div className="result-list">
      <ul>
        {state.results.map((result) => {
          const template = resultTemplatesManager.selectTemplate(result);
          if (!template)
            throw new Error(`No result template provided for ${result.title}.`);
          return template(result, props.language);
        })}
      </ul>
    </div>
  );
};

export default ResultList;