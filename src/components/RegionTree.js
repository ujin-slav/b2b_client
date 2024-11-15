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
      let resultArray = []
      let value = e.target.value
      if(value===""){
        setNodes(regionNodes)
        return
      }
      const regex = value.replace(/\\/g, "\\\\");
      regionNodes.map((itemNodes)=>{
        if(itemNodes.children){
            itemNodes.children.map((itemChildren)=>{
                if(itemChildren.label.match(regex)){
                  let search = resultArray.findIndex(item => item.value === itemNodes.value)
                  if(search==-1){
                    let newNode = JSON.parse(JSON.stringify(itemNodes))
                    newNode.children = [itemChildren]
                    resultArray.push(newNode)
                    setNodes(resultArray)
                  }else{
                    if(Array.isArray(resultArray[search].children)){
                      resultArray[search].children.push(itemChildren)
                    }
                  }
              }
          })
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