import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare,
    faChevronRight,
    faChevronDown,
    faPlusSquare,
    faMinusSquare,
    faFolder,
    faFolderOpen,
    faFile} from '@fortawesome/free-solid-svg-icons'
import { regionNodes } from '../config/Region';

class Region extends React.Component {
  state = {
    checked: [],
    expanded: [],
  };

  render() {
    return (
      <CheckboxTree
        nodes={regionNodes}
        checked={this.state.checked}
        expanded={this.state.expanded}
        onCheck={checked => this.setState({ checked })}
        onExpand={expanded => this.setState({ expanded })}
        icons={{
            check: <FontAwesomeIcon icon={faCheckSquare} />,
            uncheck: <FontAwesomeIcon className="rct-icon rct-icon-uncheck" icon={['far', 'square']} />,
            halfCheck: <FontAwesomeIcon icon={faCheckSquare} />,
            expandClose: <FontAwesomeIcon icon={faChevronRight} />,
            expandOpen: <FontAwesomeIcon icon={faChevronDown} />,
            expandAll: <FontAwesomeIcon icon={faPlusSquare} />,
            collapseAll: <FontAwesomeIcon icon={faMinusSquare} />,
            parentClose: <FontAwesomeIcon icon={faFolder} />,
            parentOpen: <FontAwesomeIcon icon={faFolderOpen} />,
            leaf: <FontAwesomeIcon icon={faFile} />
        }}
      />
    );
  }
}

export default Region;