
import React, { useState, useRef, useContext, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru"
import RegInput from "../components/RegInput";
import { useHistory } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Card,
  Table,
} from "react-bootstrap";
import { upload } from "../http/askAPI";
import ModalCT from '../components/ModalCT';
import EmailList from '../components/EmailList'
import Fountaing from '../components/Fountaing'
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import SpecOfferService from '../services/SpecOfferService'
import { Context } from "../index";
import { getCategoryName } from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import { observer } from "mobx-react-lite";
import { useParams } from 'react-router-dom';
import NoPermission from './NoPermission';
import Captcha from "demos-react-captcha";
import "../style.css";
import { B2B_ROUTE } from "../utils/routes";
import { XCircle } from 'react-bootstrap-icons';
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

const ModifySpecOffer = observer(() => {

  const { user } = useContext(Context);
  const [captcha, setCaptcha] = useState(false);
  const [submiting, setSubmiting] = useState(false)
  const [files, setFiles] = useState([])
  const [permission, setPermission] = useState(true);
  const { myalert } = useContext(Context);
  const [error, setError] = useState()
  const history = useHistory();
  let sourceElement = null
  const [sortedList, setSortedList] = useState([])
  const { id } = useParams();

  const [specOffer, setSpecOffer] = useState({
    data: {},
    nullValid: {
      code: true,
      text: true,
    },
    formErrors: {
      Price: "",
      Name: "",
      Text: "",
    }
  }
  );

  useEffect(() => {
    SpecOfferService.getSpecOfferId({ id }).then((result) => {
      if (result.status === 200) {
        result = result.data.specoffer
        let formErrors = specOffer.formErrors;
        let data = Object.assign(specOffer.data, result);
        setSpecOffer({ data, formErrors });
        if (result.Author !== user.user.id) {
          setPermission(false)
        }
        result?.Files?.map((item, index) => {
          fetch(process.env.REACT_APP_API_URL + `getpic/` + item.filename)
            .then(res => res.blob())
            .then(blob => {
              let preview = {
                fromServer: true,
                file: URL.createObjectURL(blob),
                id: item.originalname,
                blob
              }
              setSortedList(prev => {
                const newList = [...prev];
                newList[index] = preview;
                return newList;
              });
            })
        })
      } else {
        setError(result.data.errors)
      }
    })
  }, [])

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
    const newFiles = files.filter((item, index, array) => item.id !== id);
    setFiles(newFiles);

    console.log(id)
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

  const onInputChange = async (e) => {
    const sizeSortedList = sortedList.reduce((sum, val) => sum + val?.blob?.size, 0)
    if (sortedList.length + e.target.files.length < 9) {
      for (let i = 0; i < e.target.files.length; i++) {
        try {
          if (sizeSortedList + e.target.files[i].size < 5485760) {
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
    const { name, value } = e.target
    let formErrors = specOffer.formErrors
    let nullValid = specOffer.nullValid
    let data = specOffer.data
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

  const blobToFile = (item) => {
    return new File([item], "load", { type: item.type })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (captcha) {
      if (formValid(specOffer)) {
        setSubmiting(true)
        const data = new FormData();
        sortedList.forEach((item) => {
          data.append(
            "file",
            blobToFile(item)
          )
        });
        data.append("ID", id)
        data.append("Author", user.user.id)
        data.append("Text", specOffer.data.Text)
        data.append("Code", specOffer.data.Code)
        const result = await SpecOfferService.modifySpecOffer(data)
        if (result.status === 200) {
          myalert.setMessage("Предложение успешно изменено");
          //history.push(B2B_ROUTE)
        } else {
          myalert.setMessage(result?.data?.message)
        }
        setSubmiting(false)
      } else {
        myalert.setMessage("Заполнены не все поля предложения.");
      }
    } else {
      console.error("FORM INVALID");
      myalert.setMessage("Неверно введены данные с картинки(CAPTCHA)");
    }
  }

  const handleChangeCaptcha = (value) => {
    if (value) {
      setCaptcha(true)
    }
  }

  if (error) {
    return (
      <div>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ height: window.innerHeight - 54 }}
        >
          <Card style={{ width: 600 }} className="p-5 ">
            <h5>Спец.предложение не существует, или удалено.</h5>
          </Card>
        </Container>
      </div>
    )
  }

  if (!permission) {
    return (
      <NoPermission />
    )
  }


  return (
    <Container>
      <h3>Редактировать спец. предложение</h3>
      <Table>
        <col style={{ "width": "15%" }} />
        <col style={{ "width": "85%" }} />
        <tbody>
          <tr>
            <td>Артикул</td>
            <td> <Form.Control
              name="Code"
              onChange={handleChangeControl}
              defaultValue={specOffer.data.Code}
              placeholder="не обязательно"
            /></td>
          </tr>
          <tr>
            <td>Описание</td>
            <td><Form.Control
              name="Text"
              defaultValue={specOffer.data.Text}
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
            <td>Фото(не более 5 файлов по 5Mb)</td>
            <td>
              Разместите фото в нужном порядке, первое станет заглавным.
              <input type="file"
                onChange={onInputChange}
                accept="image/*"
                className="form-control"
                multiple
              />
              <div className='parentSpecOffer'>
                {listItems()}
              </div>
            </td>
          </tr>
          <tr>
          </tr>

        </tbody>
      </Table>
      <Fountaing show={submiting} />
      <Captcha onChange={handleChangeCaptcha} placeholder="Введите символы" />
      <button
        onClick={onSubmit}
        className="myButtonMessage mt-3"
      >
        Сохранить
      </button>
    </Container>
  );
});

export default ModifySpecOffer;