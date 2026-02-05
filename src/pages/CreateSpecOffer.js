
import React, { useState, useRef, useContext, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Table,
} from "react-bootstrap";
import {B2B_ROUTE} from "../utils/routes";
import SpecOfferService from '../services/SpecOfferService'
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import Captcha from "demos-react-captcha";
import "../style.css";
import bin from "../icons/bin.svg";
import { generateUUID } from '../utils/getUID'

const formValid = ({ data, nullValid, formErrors }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.keys(nullValid).forEach(field => {
    if (nullValid[field] === true) {
      const value = data[field];
      if (value === null || value === undefined || value === '') {
        valid = false;
      }
    }
  });
  return valid;
};

function rutubeValidLink(url) {
  url = url.trim().toLowerCase();

  const regex = /rutube\.ru\/(?:video|play)\/([a-f0-9]{32})(?:$|\?|\/(?:$|\?))/i;

  return regex.test(url);
}

const CreateSpecOffer = observer(() => {

  const { user } = useContext(Context);
  const [captcha, setCaptcha] = useState(false);
  const [submiting, setSubmiting] = useState(false)
  const [files, setFiles] = useState([])
  const [fileSize, setFileSize] = useState(0);
  const { myalert } = useContext(Context);
  const history = useHistory();

  let sourceElement = null
  const [sortedList, setSortedList] = useState([])

  const [specOffer, setSpecOffer] = useState({
    data: {
      text: "",
      code: "",
      rutube: ""
    },
    nullValid: {
      code: true,
      text: true,
    },
    formErrors: {
      code: "",
      text: "",
      rutube: "",
    }
  }
  );

  const handleDragStart = (event) => {
    event.target.style.opacity = 0.5
    sourceElement = event.target
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (event) => {
    event.target.classList.add('over')
  }

  const handleDragLeave = (event) => {
    event.target.classList.remove('over')
  }

  const handleDrop = (event) => {
    event.stopPropagation()
    if (sourceElement !== event.target) {
      const list = sortedList.filter((item, i) =>
        i.toString() !== sourceElement.id)
      const removed = sortedList.filter((item, i) =>
        i.toString() === sourceElement.id)[0]
      let insertAt = Number(event.target.id)

      let tempList = []

      if (insertAt >= list.length) {
        tempList = list.slice(0).concat(removed)
        setSortedList(tempList)
        event.target.classList.remove('over')
      } else
        if ((insertAt < list.length)) {
          tempList = list.slice(0, insertAt).concat(removed)

          const newList = tempList.concat(list.slice(
            insertAt))

          setSortedList(newList)
          event.target.classList.remove('over')
        }
    } else
      event.target.classList.remove('over')
  }

  const handleDragEnd = (event) => {
    event.target.style.opacity = 1
  }

  const handleChange = (event) => {
    event.preventDefault()
    const list = sortedList.map((item, i) => {
      if (i !== Number(event.target.id)) {
        return item
      }
      else return event.target.value
    })
    setSortedList(list)
  }
  const handleDelete = (event, id) => {
    event.preventDefault()
    const list = sortedList.filter((item, i) =>
      i !== Number(event.target.id))
    setSortedList(list)

    URL.revokeObjectURL(files.find(item => item.id === id))
    setFileSize(fileSize - files.find(item => item.id === id).size)
    const newFiles = files.filter((item, index, array) => item.id !== id);
    setFiles(newFiles);
  }

  const fileToBlob = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const blob = new Blob([reader.result], { type: file.type });
        resolve(blob);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  const blobToFile = (item) => {
    return new File([item?.blob], item?.id, { type: item?.type })
  }

  const onInputChange = async (e) => {
    const sizeSortedList = sortedList.reduce((sum, val) => sum + val?.blob?.size, 0)
    if (sortedList.length + e.target.files.length < 12) {
      for (let i = 0; i < e.target.files.length; i++) {
        try {
          if (sizeSortedList + e.target.files[i].size < 5242880) {
            let file = e.target.files[i]
            const blob = await fileToBlob(file);
            let preview = {
              fromServer: false,
              file: URL.createObjectURL(blob),
              id: generateUUID(),
              blob
            }
            setSortedList(((oldItems) => [...oldItems, preview]))
          } else {
            myalert.setMessage("Превышен размер файлов");
          }
        } catch (e) {
          console.log(e)
        }
      }
    } else {
      myalert.setMessage("Превышено количество файлов");
    }
  };


  const listItems = () => {

    return sortedList.map((item, i) => {
      return (
        <div key={i} className='dnd-list mt-3'>
          <div className='fotoContainer'>
            <div className="delSpecOfferContainer">
              <img
                className="delSpecOffer"
                src={bin}
                id={i}
                onClick={(event) => handleDelete(event, sortedList[i])}
              />
            </div>
            <img
              id={i}
              draggable='true'
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onChange={handleChange}
              className="foto mx-2" src={sortedList[i]?.file} />
          </div>
        </div>
      )
    }
    )
  }

  const handleChangeControl = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = specOffer.formErrors;
    let data = specOffer.data
    let nullValid = specOffer.nullValid
    data[name] = value;

    switch (name) {
      case "text":
        formErrors.Text =
          value.length < 3 ? "минимум 3 символа" : "";
        break;
      case "code":
        formErrors.Code =
          value.length < 3 ? "минимум 3 символа" : "";
        break;
      case "rutube":
        formErrors.Rutube =
          !rutubeValidLink(value) && value.length > 0 ? "ссылка не действительна" : "";
        break;
      default:
        break;
    }
    setSpecOffer({ data, nullValid, formErrors });
  }

  const onSubmit = async (e) => {
    if (!captcha) {
      myalert.setMessage("Неверно введены данные с картинки(CAPTCHA)")
      return
    }
    if (!formValid(specOffer)) {
      myalert.setMessage("Форма заполнена неверно")
      console.log(specOffer)
      return
    }
    setSubmiting(true)
    const data = new FormData();
    data.append("author", user.user.id)
    data.append("text", specOffer.data.text)
    data.append("code", specOffer.data.code)
    data.append("rutube", specOffer.data.rutube)
    data.append("sortedList",
      JSON.stringify(sortedList.map(item => item.id))
    )
    sortedList.forEach((item) => {
      data.append(
        "file",
        blobToFile(item)
      )
    });
    const result = await SpecOfferService.addSpecOffer(data)
    if (result.status === 200) {
      myalert.setMessage("Предложение успешно добавлено");
      history.push(B2B_ROUTE)
    } else {
      myalert.setMessage(result?.data?.message)
    }
    setSubmiting(false)
  }

  const handleChangeCaptcha = (value) => {
    if (value) {
      setCaptcha(true)
    }
  }

  return (
    <div>
      <Container className="profile">
        <h3>Создать специальное предложение</h3>
        <Row>
          <Col>
            <Table>
              <col style={{ "width": "25%" }} />
              <col style={{ "width": "75%" }} />
              <tbody>
                <tr>
                  <td>Артикул</td>
                  <td> <Form.Control
                    name="code"
                    onChange={handleChangeControl}
                    placeholder="Артикул"
                  />
                    <span className="errorMessage" style={{ color: "red" }}>{specOffer.formErrors.Code}</span>
                  </td>
                </tr>
                <tr>
                  <td>Описание</td>
                  <td><Form.Control
                    name="text"
                    placeholder="Текст заявки"
                    onChange={handleChangeControl}
                    as="textarea"
                  />
                    <span className="errorMessage" style={{ color: "red" }}>{specOffer.formErrors.Text}</span>
                  </td>
                </tr>
                <tr>
                  <td>Ссылка на видео(Rutube)</td>
                  <td><Form.Control
                    name="rutube"
                    placeholder="Ссылка"
                    onChange={handleChangeControl}
                  />
                    <span className="errorMessage" style={{ color: "red" }}>{specOffer.formErrors.Rutube}</span>
                  </td>
                </tr>
                <tr>
                  <td>Фото(будут храниться не более 30 дней, не более 5 файлов по 5Mb)</td>
                  <td>
                    Разместите фото в нужном порядке, первое станет заглавным.
                    <input type="file"
                      onChange={onInputChange}
                      accept="image/*"
                      className="form-control"
                      multiple />
                    <div className='parentSpecOffer'>
                      {listItems()}
                    </div>
                  </td>
                </tr>
                <tr>
                </tr>

              </tbody>
            </Table>
            <Captcha onChange={handleChangeCaptcha} placeholder="Введите символы" />
            <button
              onClick={onSubmit}
              className="myButtonMessage mt-3"
            >
              Создать
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
});

export default CreateSpecOffer;