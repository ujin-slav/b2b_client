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

const RegionTree =({checked, expanded, setChecked, setExpanded, max})=> {
    
    const prevChecked = checked
    const res = checked.reduce((acc, cat) => {
      const domain = cat.substring(0,cat.indexOf('_')+1)
      if (!acc[domain]) {
          acc[domain] = []
      }
      acc[domain].push(cat)
      return acc ? acc : {} 
    },{})

    const onCheck=(checked)=>{
      if(Object.keys(res).length < max){
        setChecked(checked)
      }else{
        if(checked.length>prevChecked.length){
          setChecked(prevChecked)
        }else{
          setChecked(checked)
        }
      }
    }

    return (
      <CheckboxTree
        nodes={regionNodes}
        checked={checked}
        expanded={expanded}
        onCheck={checked => onCheck(checked)}
        onExpand={expanded =>{setExpanded(expanded)}}
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