import React, { Component } from 'react';
import PropTypes from 'prop-types';
import intersection from 'lodash/intersection';
import isSubset from 'is-subset';

export function Permissible(
  RestrictedComponent,
  userPermissions,
  requiredPermissions,
  callbackFunction,
  oneperm,
) {
  const permissionsStatus = oneperm
    ? intersection(userPermissions, requiredPermissions).length
    : isSubset(userPermissions, requiredPermissions);

  class PermissibleHOC extends Component {
    static propTypes = {
      oneperm: PropTypes.bool,
      history: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    };

    constructor(props) {
      super(props);

      if (!permissionsStatus) {
        this.runCallback();
      }
    }

    runCallback() {
      if (callbackFunction) {
        return callbackFunction({
          userPermissions,
          requiredPermissions,
        },
        this.props.history);
      }
      return;
    }

    render() {
      if (permissionsStatus) {
        return <RestrictedComponent {...this.props}/>;
      }
      return null;
    }
  }
  return PermissibleHOC;
}
