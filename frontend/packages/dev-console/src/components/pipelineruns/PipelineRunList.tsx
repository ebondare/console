import * as React from 'react';
import { Table } from '@console/internal/components/factory';
import { PipelineRunModel } from '../../models';
import PipelineRunHeader from './PipelineRunHeader';
import PipelineRunRow from './PipelineRunRow';

export const PipelineRunList: React.FC = (props) => (
  <Table
    {...props}
    aria-label={PipelineRunModel.labelPlural}
    Header={PipelineRunHeader}
    Row={PipelineRunRow}
    virtualize
  />
);

export default PipelineRunList;
