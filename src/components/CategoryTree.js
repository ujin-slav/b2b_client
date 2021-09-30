import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { PlusCircle, 
  DashCircleFill, 
  Folder, 
  Folder2Open,
  FileEarmark, 
  ChevronDown, 
  ChevronRight } from 'react-bootstrap-icons';
import { categoryNodes } from '../config/Category';

const CategoryTree =({checked, expanded, setChecked, setExpanded})=> {
  return (
    <CheckboxTree
      nodes={categoryNodes}
      checked={checked}
      expanded={expanded}
      onCheck={checked => {setChecked(checked)}}
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

export default CategoryTree;