import React from 'react';
import classnames from 'classnames';

import {angulars} from '../react-wrapper';
import {injectChild, WithQuery} from '../utils';

const DetailsColumn = (props) => {
  const {selected, data, children} = props;

  if (!selected || !data) {
    return <div>{children}</div>
  }

  const {k8s: {getQN}} = angulars;
  const object = _.find(data, o => getQN(o) === selected);

  if (!object) {
    return <div>{children}</div>
  }

  return injectChild(children, object);
}

export class TwoColumns extends React.Component {
  componentDidMount () {
    const {hash} = location;
    if (!hash) {
      return;
    }

    this.list.selectRow(decodeURI(hash).slice(1));
  }

  render () {
    const List = this.props.list;

    return (
      <div className="co-m-pane">
        <div className="co-m-pane__body">
          <div className="row">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <div className="co-facet-container--left">
                <div className="co-m-pane__body__top-controls">
                  <input autoFocus={true} type="text" className="form-control" placeholder="Filter by name..." onChange={e => this.list.applyFilter('name', e.target.value)} />
                </div>
                <List ref={ref => this.list = ref} {...this.props} />
              </div>
            </div>
            <div className="col-md-8 col-sm-6 col-xs-12">
              <WithQuery k8sResource={List.k8sResource} isList={true} {...this.props}>
                <DetailsColumn>
                  {this.props.children}
                </DetailsColumn>
              </WithQuery>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// A simple Component that Wraps List's Rows for changing hashes
TwoColumns.RowWrapper = (object) => {
  const {onClick, isActive, children} = object;

  const klass = classnames('row co-m-facet-menu-option', {'co-m-facet-option--active': isActive});

  const _onClick = () => {
    const {k8s: {getQN}} = angulars;
    const qualifiedName = getQN(object);
    angulars.$location.hash(qualifiedName);
    onClick(qualifiedName);
  };
  return <div className={klass} onClick={_onClick}>
    {children}
  </div>
};

TwoColumns.propTypes = {
  'list': React.PropTypes.func,
};