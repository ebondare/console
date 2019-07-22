import * as React from 'react';
import * as _ from 'lodash';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '@console/internal/components/dashboard/dashboard-card';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboards-page/with-dashboard-resources';
import { getPropsData } from '../../utils';
import { ObjectDataReductionQueries } from '../../queries';
import { EfficiencyItem, SavingsItem } from './object-data-reduction-card-item';
import './object-data-reduction-card.scss';

const DataReductionCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  React.useEffect(() => {
    Object.keys(ObjectDataReductionQueries).forEach((key) =>
      watchPrometheus(ObjectDataReductionQueries[key]),
    );
    return () =>
      Object.keys(ObjectDataReductionQueries).forEach((key) =>
        stopWatchPrometheusQuery(ObjectDataReductionQueries[key]),
      );
  }, [watchPrometheus, stopWatchPrometheusQuery]);

  const efficiencyQueryResult = prometheusResults.getIn([
    ObjectDataReductionQueries.EFFICIENCY_QUERY,
    'result',
  ]);
  const savingsQueryResult = prometheusResults.getIn([
    ObjectDataReductionQueries.SAVINGS_QUERY,
    'result',
  ]);

  const efficiency = getPropsData(efficiencyQueryResult);
  const savings = getPropsData(savingsQueryResult);
  const logicalSize = _.get(savingsQueryResult, 'data.result[0].metric.logical_size', null);

  const efficiencyProps = {
    efficiency,
    isLoading: !efficiencyQueryResult,
  };

  const savingsProps = {
    savings,
    logicalSize,
    isLoading: !savingsQueryResult,
  };

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Object Data Reduction</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <EfficiencyItem {...efficiencyProps} />
        <SavingsItem {...savingsProps} />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(DataReductionCard);
