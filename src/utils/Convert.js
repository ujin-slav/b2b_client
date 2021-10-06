export const getCategoryName = (checked,nodes) => {
    let resultArray = []
    
    checked.map((itemChecked)=>{
        nodes.map((itemNodes)=>{
            if(itemChecked===itemNodes.value){
                resultArray.push(itemNodes.label)
            }
            if(itemNodes.children){
                itemNodes.children.map((itemChildren)=>{
                    if(itemChecked===itemChildren.value){
                        resultArray.push(itemChildren.label)
                    }
                })
            }
        })
    })
    return resultArray
}    