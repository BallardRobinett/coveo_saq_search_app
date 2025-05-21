import {
  buildCriterionExpression,
  Sort as HeadlessSort,
  SortCriterion,
  buildRelevanceSortCriterion,
  buildDateSortCriterion,
  SortOrder,
  buildFieldSortCriterion,
  buildNoSortCriterion
} from '@coveo/headless';
import { useEffect, useState, FunctionComponent } from 'react';
import { AppLanguage } from '../App';
 
interface SortProps {
  controller: HeadlessSort;
  criteria: [string, SortCriterion][];
  language: AppLanguage;
}
 
export const Sort: FunctionComponent<SortProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);
 
  useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);
 
  const getCriterionFromName = (name: string) =>
    props.criteria.find(([criterionName]) => criterionName === name)!;
 
  const getCurrentCriterion = () =>
    props.criteria.find(
      ([, criterion]) =>
        state.sortCriteria === buildCriterionExpression(criterion)
    )!;
 
  return (
    <div className="sort">
      <p>{props.language === 'en' ? 'Sort by:' : 'Trier par:'}&nbsp;</p>
      <select
        value={getCurrentCriterion()[0]}
        onChange={(e) =>
          controller.sortBy(getCriterionFromName(e.target.value)[1])
        }
        >
        {props.criteria.map(([criterionName]) => (
          <option key={criterionName} value={criterionName}>
            {criterionName}
          </option>
        ))}
      </select>
    </div>
  );
};

export const criteria: [string, SortCriterion][] = [
  ['Relevance', buildRelevanceSortCriterion()],
  ['Name (A-Z)', buildFieldSortCriterion('product_name', SortOrder.Ascending)],
  ['Name (Z-A)', buildFieldSortCriterion('product_name', SortOrder.Descending)],
  ['Price (Lowest to Highest)', buildFieldSortCriterion('ec_price', SortOrder.Ascending)],
  ['Price (Highest to Lowest)', buildFieldSortCriterion('ec_price', SortOrder.Descending)],
  ['Rating (Highest to Lowest)', buildFieldSortCriterion('product_rating', SortOrder.Descending)],
  ['Rating (Lowest to Highest)', buildFieldSortCriterion('product_rating', SortOrder.Ascending)],
  ['Availability (Highest to Lowest)', buildFieldSortCriterion('product_availability', SortOrder.Descending)],
  ['Availability (Lowest to Highest)', buildFieldSortCriterion('product_availability', SortOrder.Ascending)],
];