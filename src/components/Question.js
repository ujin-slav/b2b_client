import React, { Component } from "react";
import { Form,
        InputGroup,
        Button
     } from "react-bootstrap";
  
const Question =({...props})=>{
    const {offers,
        author} = props        

        return (
            <div>
            <InputGroup> 
            <Form.Label className="px-3 mt-2">Кому:</Form.Label>
                <Form.Control
                    as="select"         
                >       
                     <option value={author}>Автору: {author}</option>
                     {offers?.map((item,index)=>
                        <option value={item.Author}>{item.Author}</option>
                     )}
                </Form.Control>
                <Button>Отправить
                </Button> 
            </InputGroup>
            <Form.Control
                    name="Text"
                    placeholder="Текст сообщения"
                    as="textarea"
            />
            </div>
        );
    }
  
export default Question;