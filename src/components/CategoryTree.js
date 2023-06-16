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

const CategoryTree =({checked, expanded, setChecked, setExpanded, max})=> {

  const prevChecked = checked
  const res = checked.reduce((acc, cat) => {
    const domain = cat.substring(0,cat.indexOf('_')+1)
    if (!acc[domain]) {
        acc[domain] = []
    }
    acc[domain].push(cat)
    return acc ? acc : {} 
  },{})
  console.log(Object.keys(res).length > max ? 'больше' : 'меньше')

  return (
    <CheckboxTree
      nodes={categoryNodes}
      checked={checked}
      expanded={expanded}
      onCheck={checked => {Object.keys(res).length < max ? setChecked(checked) : setChecked(prevChecked)}}
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