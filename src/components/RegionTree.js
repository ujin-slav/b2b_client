import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare,
    faChevronRight,
    faChevronDown,
    faPlusSquare,
    faMinusSquare,
    faSquareFull,
    faFolder,
    faFolderOpen,
    faCheck,
    faFile,
    faSquare,
    faCheckCircle} from '@fortawesome/free-solid-svg-icons'
import { regionNodes } from '../config/Region';

const RegionTree =({checked, expanded, setChecked, setExpanded})=> {
    return (
      <CheckboxTree
        nodes={regionNodes}
        checked={checked}
        expanded={expanded}
        onCheck={checked => {setChecked(checked) 
        console.log(checked)}}
        onExpand={expanded => setExpanded(expanded)}
        icons={{
            check: <FontAwesomeIcon icon={faCheck}/>,
            uncheck: <FontAwesomeIcon icon={faSquare} />,
            halfCheck: <FontAwesomeIcon icon={faCheckSquare} />,
            expandClose: <FontAwesomeIcon icon={faChevronRight} />,
            expandOpen: <FontAwesomeIcon icon={faChevronDown} />,
            expandAll: <FontAwesomeIcon icon={faPlusSquare} />,
            collapseAll: <FontAwesomeIcon icon={faMinusSquare} />,
            parentClose: <FontAwesomeIcon icon={faFolder}  color="gray"/>,
            parentOpen: <FontAwesomeIcon icon={faFolderOpen} color="gray"/>,
            leaf: <FontAwesomeIcon icon={faFile} />
        }}
      />
    );
  }

export default RegionTree;