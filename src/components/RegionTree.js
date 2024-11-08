import {React,useState} from 'react'
import CheckboxTree from 'react-checkbox-tree';
import { regionNodes } from '../config/Region';
import { PlusCircle, 
        DashCircleFill, 
        Folder, 
        Folder2Open,
        FileEarmark, 
        ChevronDown, 
        ChevronRight } from 'react-bootstrap-icons';
import {Form} from "react-bootstrap";

const RegionTree =({checked, expanded, setChecked, setExpanded, max})=> {

  const[nodes,setNodes] = useState(regionNodes)
  let resultArray = [].concat(regionNodes)
    
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

    const handleControl = (e)=> {
      let value = e.target.value
      if(value===""){
        return
      }
      const regex = value.replace(/\s{20000,}/g, '*.*')
      resultArray.map((itemNodes,indexNodes)=>{
        if(itemNodes.children){
          itemNodes.children.map((itemChildren,indexChildren)=>{
                if(!itemChildren.label.match(regex)){
                  itemNodes.children.splice(indexChildren,1)
                }
          })
        }
        if(Array.isArray(itemNodes.children)){
          if(itemNodes.children.length==0){
            resultArray.splice(indexNodes,1)
            setNodes(resultArray)
          }
        }
      })
    }  

    return (
      <div>
        <Form.Control
          placeholder="Поиск"
          onChange={(e)=>handleControl(e)}
          className="mb-3"
        />
        <CheckboxTree
        nodes={nodes}
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
      </div>
    );
  }

export default RegionTree;