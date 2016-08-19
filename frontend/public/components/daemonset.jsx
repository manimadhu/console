import React from 'react';

import {angulars} from './react-wrapper';

import withPodList from './withPodList';
import createListComponent from './list-factory';
import createPageComponent from './page-factory';
import createDetailsPage from './detail-page-factory';

import {Cog, LabelList, ResourceIcon, Selector, Timestamp, asVertNav, detailsPage} from './utils'

const DaemonSetCog = ({daemonset}) => {
  const kind = angulars.kinds.DAEMONSET;
  const {factory: {ModifyLabels, Delete}} = Cog;
  return <Cog options={[ModifyLabels, Delete].map(f => f(kind, daemonset))} size="small" anchor="left"></Cog>;
}

const DaemonSetHeader = () => <div className="row co-m-table-grid__head">
  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">Name</div>
  <div className="col-lg-3 col-md-3 col-sm-5 col-xs-6">Labels</div>
  <div className="col-lg-3 col-md-3 col-sm-4 hidden-xs">Status</div>
  <div className="col-lg-3 col-md-3 hidden-sm hidden-xs">Node Selector</div>
</div>

const DaemonSetRow = (daemonset) => <div className="row co-m-table-grid--clickable co-resource-list__item">
  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
    <DaemonSetCog daemonset={daemonset}></DaemonSetCog>
    <ResourceIcon kind="daemonset"></ResourceIcon>
    <a href={`ns/${daemonset.metadata.namespace}/daemonsets/${daemonset.metadata.name}/details`} title={daemonset.metadata.uid}>
      {daemonset.metadata.name}
    </a>
  </div>
  <div className="col-lg-3 col-md-3 col-sm-5 col-xs-6">
    <LabelList kind="daemonset" labels={daemonset.metadata.labels}  />
  </div>
  <div className="col-lg-3 col-md-3 col-sm-4 hidden-xs">
    {daemonset.status.currentNumberScheduled} of {daemonset.status.desiredNumberScheduled} pods
  </div>
  <div className="col-lg-3 col-md-3 hidden-sm hidden-xs">
    <Selector selector={daemonset.spec.selector.matchLabels}></Selector>
  </div>
</div>

const Details = (daemonset) => <div>
  <div className="col-lg-6">
    <dl>
      <dt>Name</dt>
      <dd>{daemonset.metadata.name || '-'}</dd>
      <dt>Labels</dt>
      <dd><LabelList kind="daemonset" labels={daemonset.metadata.labels} expand={true} /></dd>
      <dt>Pod Selector</dt>
      <dd><Selector selector={daemonset.spec.selector.matchLabels} expand={true} /></dd>
      <dt>Created At</dt>
      <dd><Timestamp timestamp={daemonset.metadata.creationTimestamp} /></dd>
    </dl>
  </div>
  <div className="col-lg-6">
    <dl>
      <dt>Current Count</dt>
      <dd>{daemonset.status.currentNumberScheduled || '-'}</dd>
      <dt>Desired Count</dt>
      <dd>{daemonset.status.desiredNumberScheduled || '-'}</dd>
    </dl>
  </div>
</div>

const {factory: {pods, yaml}} = detailsPage;
const pages = [{href: 'details', name: 'Details', component: detailsPage(Details)}, pods(), yaml()];

const DaemonSets = createListComponent('DaemonSets', 'DAEMONSET', DaemonSetHeader, withPodList(DaemonSetRow));
const DaemonSetsPage = createPageComponent('DaemonSetsPage', 'DAEMONSET', DaemonSets);
const DaemonSetsDetailsPage = createDetailsPage('DaemonSetsDetailsPage', 'DAEMONSET', asVertNav(pages));

export {DaemonSets, DaemonSetsPage, DaemonSetsDetailsPage};