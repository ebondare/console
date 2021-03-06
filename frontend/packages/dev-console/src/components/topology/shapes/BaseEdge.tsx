import * as React from 'react';
import * as classNames from 'classnames';
import { createSvgIdUrl } from '../../../utils/svg-utils';
import { ViewNode } from '../topology-types';

import './BaseEdge.scss';

type BaseEdgeProps = {
  source: ViewNode;
  target: ViewNode;
  sourceMarkerId?: string;
  targetMarkerId?: string;
  isDragging?: boolean;
};

const BaseEdge: React.SFC<BaseEdgeProps> = ({
  source,
  target,
  sourceMarkerId,
  targetMarkerId,
  isDragging,
}) => (
  <line
    className={classNames('odc-base-edge', { 'odc-m-is-highlight': isDragging })}
    x1={source.x}
    y1={source.y}
    x2={target.x}
    y2={target.y}
    markerStart={sourceMarkerId ? createSvgIdUrl(sourceMarkerId) : undefined}
    markerEnd={targetMarkerId ? createSvgIdUrl(targetMarkerId) : undefined}
  />
);

export default BaseEdge;
