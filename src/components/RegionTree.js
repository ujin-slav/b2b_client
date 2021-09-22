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
import SimpleLineIcon from 'react-simple-line-icons';
import { ArrowRight, PlusCircle, DashCircleFill, Folder, Folder2Open,FileEarmark, ChevronDown, ChevronRight } from 'react-bootstrap-icons';

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
            check: <DashCircleFill/>,
            uncheck: <PlusCircle/>,
            halfCheck: <DashCircleFill/>,
            expandClose: <ChevronRight/>,
            expandOpen: <ChevronDown/>,
            expandAll: <FontAwesomeIcon icon={faPlusSquare} />,
            collapseAll: <FontAwesomeIcon icon={faMinusSquare} />,
            parentClose: <Folder/>,
            parentOpen: <Folder2Open/>,
            leaf: <FileEarmark/>
        }}
      />
    );
  }

export default RegionTree;