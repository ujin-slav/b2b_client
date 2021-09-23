import React, { useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { regionNodes } from '../config/Region';
import { PlusCircle, 
        DashCircleFill, 
        Folder, 
        Folder2Open,
        FileEarmark, 
        ChevronDown, 
        ChevronRight } from 'react-bootstrap-icons';

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
            uncheck: <PlusCircle />,
            halfCheck: <DashCircleFill />,
            expandClose: <ChevronRight />,
            expandOpen: <ChevronDown />,
            expandAll: <ChevronDown />,
            collapseAll:  <ChevronRight/>,
            parentClose: <Folder style={{"width": "25px", "height": "25px"}}/>,
            parentOpen: <Folder2Open style={{"width": "25px", "height": "25px"}}/>,
            leaf: <FileEarmark style={{"width": "20px", "height": "20px"}}/>
        }}
      />
    );
  }

export default RegionTree;