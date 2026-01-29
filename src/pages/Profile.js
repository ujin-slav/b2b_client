import { React, useEffect, useContext, useState, useRef, useMemo } from 'react';
import { Card, Table, Col, Container, Row, Lable, Form, Button, InputGroup } from "react-bootstrap";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import RegionTree from '../components/RegionTree';
import CategoryTree from '../components/CategoryTree';
import ModalCT from '../components/ModalCT';
import { getCategoryName } from '../utils/Convert'
import { regionNodes } from '../config/Region';
import { categoryNodes } from '../config/Category';
import AuthService from "../services/AuthService";
import MyImage from '../components/MyImage'
import bin from "../icons/bin.svg";
import {generateUUID} from '../utils/getUID'

const formValid = ({ data, formErrors, nullValid }) => {
  let valid = true;
  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(data).forEach(val => {
    val === null && (valid = false);
  });

  return valid;
};

function rutubeValidLink(url) {
  url = url.trim().toLowerCase();

  const regex = /rutube\.ru\/(?:video|play)\/([a-f0-9]{32})(?:\/|$|\?)/i;

  return regex.test(url);
}

const Profile = observer(() => {

  const { user } = useContext(Context);
  const { myalert } = useContext(Context);
  const [file, setFile] = useState([])
  const [deletedLogo, setDeletedLogo] = useState(false)
  const [changedLogo, setChangedLogo] = useState(false)
  
  const [sortedList, setSortedList] = useState([])
  const [deletedList, setDeletedList] = useState([])

  let sourceElement = null

  const [profile, setProfile] = useState({
    data: {
      name: null,
      nameOrg: null,
      adressOrg: null,
      telefon: null,
      site: null,
      inn: null,
      description: null,
      notiInvited: true,
      notiMessage: true,
      notiAsk: true,
      getAskFromFiz: true
    },
    nullValid: {
      name: true
    },
    formErrors: {
      name: "",
      nameOrg: "",
      adressOrg: "",
      telefon: "",
      Inn: ""
    }
  });

  useEffect(() => {
    if (user.user.category) {
      setCheckedCat(Object.values(user.user.category))
    }
    if (user.user.region) {
      setCheckedRegion(Object.values(user.user.region))
    }
    let data = profile.data
    let formErrors = profile.formErrors
    !!user.user.notiInvited && (data.notiInvited = user.user.notiInvited)
    !!user.user.notiMessage && (data.notiMessage = user.user.notiMessage)
    !!user.user.notiAsk && (data.notiAsk = user.user.notiAsk)
    !!user.user.getAskFromFiz && (data.getAskFromFiz = user.user.getAskFromFiz)
    setProfile({ data, formErrors });
    if (user.user.logo) {
      fetch(process.env.REACT_APP_API_URL + `getlogo/` + user.user.logo?.filename)
        .then(res => res.blob())
        .then(blob => {
          setFile(blob)
        })
    }
    if (user.user.filesMini) {
      user.user.filesMini?.map((item) => {
        fetch(process.env.REACT_APP_API_URL + `getalbum/` + item.filename)
          .then(res => res.blob())
          .then(blob => {
            let preview = {
              fromServer:true,
              file: URL.createObjectURL(blob),
              id: item.originalname,
              blob
            }
            setSortedList(((oldItems) => [...oldItems, preview]))
          })
      })
    }
  }, [user.user]);

  ///////////////////

  const imageUrl = useMemo(() => {
    if (!file) return null;
    if (!(file instanceof Blob) && !(file instanceof File)) {
      return null;
    }
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const [modalActiveReg, setModalActiveReg] = useState(false)
  const [modalActiveCat, setModalActiveCat] = useState(false)
  const [checkedRegion, setCheckedRegion] = useState([]);
  const [expandedRegion, setExpandedRegion] = useState([]);
  const [checkedCat, setCheckedCat] = useState([]);
  const [expandedCat, setExpandedCat] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formErrors = profile.formErrors;
    let data = profile.data
    let nullValid = profile.nullValid
    data[name] = value;

    switch (name) {
      case "name":
        formErrors.name =
          value.length < 3 ? "минимум 3 символа" : "";
        break;
      case "nameOrg":
        formErrors.nameOrg =
          value.length < 3 && value.length > 0 ? "минимум 3 символа" : "";
        break;
      case "inn":
        formErrors.inn =
          value.length < 8 && value.length > 0 ? "минимум 3 символа" : "";
        break;
      case "adressOrg":
        formErrors.adressOrg =
          value.length < 3 && value.length > 0 ? "минимум 3 символа" : "";
        break;
      case "telefon":
        formErrors.telefon =
          value.length < 3 && value.length > 0 ? "минимум 3 символа" : "";
        break;
      default:
        break;
    }
    setProfile({ data, nullValid, formErrors });
  }

  const handleChangeRutube = (e) => {
    const { name, value } = e.target;
    rutubeValidLink(value)
  }

  const blobToFile = (item) => {
    return new File([item?.blob], item?.id , { type: item?.type })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    let formErrors = profile.formErrors;
    let data = profile.data

    for (var key in data) {
      data[key] === null && (data[key] = user.user[key]);
    }

    if (formValid(profile)) {
      const formData = new FormData();
      const formDataAlbum = new FormData();

      formDataAlbum.append("id", user.user.id)
      formDataAlbum.append("deletedList", JSON.stringify(deletedList))
      formDataAlbum.append("sortedList", 
        JSON.stringify(sortedList.map(item => item.id))
      )
      formData.append("id", user.user.id)
      formData.append("name", data.name)
      formData.append("nameOrg", data.nameOrg)
      formData.append("adressOrg", data.adressOrg)
      formData.append("telefon", data.telefon)
      formData.append("site", data.site)
      formData.append("description", data.description)
      formData.append("inn", data.inn)
      formData.append("region", JSON.stringify(checkedRegion))
      formData.append("category", JSON.stringify(checkedCat))
      formData.append("notiInvited", data.notiInvited)
      formData.append("notiMessage", data.notiMessage)
      formData.append("notiAsk", data.notiAsk)
      formData.append("getAskFromFiz", data.getAskFromFiz)
      formData.append("deletedLogo", deletedLogo)
      formData.append("changedLogo", changedLogo)

      sortedList.forEach((item) => {
        if(!item.fromServer){
          console.log(item)
          formDataAlbum.append(
            "file",
            blobToFile(item)
          )
        }
      });

      if (file.length !== 0 && changedLogo) {
        formData.append("file", blobToFile(file))
      } else {
        formData.append("file", null)
      }

      const result = await AuthService.changeuser(formData);
      if (result.status === 200) {
        user.setUser(result.data.user);
        myalert.setMessage("Данные успешно сохранены");
      } else {
        myalert.setMessage(result.data.message);
      }

      const resultAlbum = await AuthService.changeAlbum(formDataAlbum);
      if (resultAlbum.status === 200) {
        user.setUser(resultAlbum.data.user);
        myalert.setMessage("Данные успешно сохранены");
      } else {
        myalert.setMessage(resultAlbum.data.message);
      }
    } else {
      myalert.setMessage("Форма заполнена не верно")
    }
  }

  const handleChecked = (e) => {
    const { name, checked } = e.target;
    let data = profile.data
    let formErrors = profile.formErrors
    data[name] = checked
    setProfile({ data, formErrors });
  }

  const onInputChange = (e) => {
    try {
      if (e.target.files[0].size < 5242880) {
        let newFile = e.target.files[0]
        if(file.length !== 0){
          setChangedLogo(true)
        }
        setFile(newFile)
        setChangedLogo(true)
      } else {
        myalert.setMessage("Превышен размер файла");
      }
    } catch (e) {
      console.log(e)
    }
  };

  const logo = () => {
    if (file.length !== 0) {
      return (
        <span style={{ 'display': 'grid' }}>
          <MyImage
            className={"fotoSpec"}
            disabled={false}
            src={imageUrl} />
          <div className="ImgSpecWrapper">
            <MyImage
              src={imageUrl}
              disabled={false}
              className={"fotoSpecBack"}
            />
          </div>
        </span>
      )
    } else {
      return (
        <span></span>
      )
    }
  }

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

  const handleChangeFoto = (event) => {
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

    let num = Number(event.target.id)
    let el = sortedList[num]
    if(el?.fromServer){
      setDeletedList(((oldItems) => [...oldItems,el?.id]))
    }
    const list = sortedList.filter((item, i) =>
      i !== num)
    setSortedList(list)
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

  const onInputChangeFoto = async (e) => {
    const sizeSortedList = sortedList.reduce((sum, val) => sum + val?.blob?.size, 0)
    if (sortedList.length + e.target.files.length < 9) {
      for (let i = 0; i < e.target.files.length; i++) {
        try {
          if (sizeSortedList + e.target.files[i].size < 5485760) {
            let file = e.target.files[i]
            const blob = await fileToBlob(file);
            //file.id = Date.now() + Math.random()
            let preview = {
              fromServer:false,
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
              onChange={handleChangeFoto}
              className="foto mx-2" src={sortedList[i]?.file} />
          </div>
        </div>
      )
    }
    )
  }

  return (
    <div>
      <Container className="profile">
        <Row>
          <Col>
            <Table>
              <col style={{ "width": "25%" }} />
              <col style={{ "width": "75%" }} />
              <tbody>
                <tr>
                  <td>Логотип</td>
                  <td>
                    {logo()}
                    {file.length !== 0 ?
                      <div className='delLogoContainer mt-3' onClick={() => {
                        setDeletedLogo(true)
                        setFile([])
                      }}>
                        <img
                          className="delProfileFoto"
                          src={bin}
                        />
                        <div>
                          Удалить лого
                        </div>
                      </div>
                      :
                      <span>
                      </span>
                    }
                    <input type="file"
                      accept="image/png, image/jpeg"
                      onChange={onInputChange}
                      className="form-control"
                      single />
                  </td>
                </tr>
                <tr>
                  <td>Фото(не более 5 файлов по 5Mb)</td>
                  <td>
                    Разместите фото в нужном порядке.
                    <div className='parentSpecOffer'>
                      {listItems()}
                    </div>
                    <input type="file"
                      onChange={onInputChangeFoto}
                      key={Date.now()}
                      accept="image/*"
                      className="form-control"
                      multiple />
                  </td>
                </tr>
                <tr>
                  <td>Ссылка на видео(Rutube)</td>
                  <td><Form.Control
                    name="name"
                    type="text"
                    onChange={handleChangeRutube}
                    defaultValue={user.user.rutube}
                  /><span className="errorMessage" style={{ color: "red" }}>{profile.formErrors.rutube}</span></td>
                </tr>
                <tr>
                  <td>Имя</td>
                  <td><Form.Control
                    name="name"
                    type="text"
                    onChange={handleChange}
                    defaultValue={user.user.name}
                  />
                    <span className="errorMessage" style={{ color: "red" }}>{profile.formErrors.name}</span></td>
                </tr>
                <tr>
                  <td>Описание</td>
                  <td><Form.Control
                    name="description"
                    type="text"
                    as="textarea"
                    onChange={handleChange}
                    defaultValue={user.user.description}
                  />
                  </td>
                </tr>
                <tr>
                  <td>Название организации</td>
                  <td> <Form.Control
                    name="nameOrg"
                    type="text"
                    onChange={handleChange}
                    defaultValue={user.user.nameOrg}
                  />
                    <span className="errorMessage" style={{ color: "red" }}>{profile.formErrors.nameOrg}</span></td>
                </tr>
                <tr>
                  <td>Адрес организации</td>
                  <td> <Form.Control
                    name="adressOrg"
                    type="text"
                    onChange={handleChange}
                    defaultValue={user.user.adressOrg}
                  />
                    <span className="errorMessage" style={{ color: "red" }}>{profile.formErrors.adressOrg}</span></td>
                </tr>
                <tr>
                  <td>ИНН</td>
                  <td> <Form.Control
                    name="inn"
                    type="text"
                    onChange={handleChange}
                    defaultValue={user.user.inn}
                  />
                    <span className="errorMessage" style={{ color: "red" }}>{profile.formErrors.inn}</span></td>
                </tr>
                <tr>
                  <td>Контактный телефон</td>
                  <td>
                    <Form.Control
                      name="telefon"
                      type="text"
                      onChange={handleChange}
                      defaultValue={user.user.telefon}
                    />
                    <span className="errorMessage" style={{ color: "red" }}>{profile.formErrors.telefon}</span></td>
                </tr>
                <tr>
                  <td>Сайт</td>
                  <td>
                    <Form.Control
                      name="site"
                      type="text"
                      onChange={handleChange}
                      defaultValue={user.user.site}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Категории</td>
                  <td>
                    <Card body>{getCategoryName(checkedCat, categoryNodes).join(", ")}</Card>
                    <button className="myButtonMessage mt-1" onClick={() => setModalActiveCat(true)}>
                      Выбор
                    </button></td>
                </tr>
                <tr>
                  <td>Регионы</td>
                  <td>
                    <Card body>{getCategoryName(checkedRegion, regionNodes).join(", ")}</Card>
                    <button className="myButtonMessage mt-1" onClick={() => setModalActiveReg(true)}>
                      Выбор
                    </button></td>
                </tr>
                <tr>
                  <td>
                    Получать уведомления на email:
                  </td>
                </tr>
                <tr>
                  <td>
                    Новые приглашения на участие
                  </td>
                  <td>
                    <Form.Check
                      name="notiInvited"
                      type="checkbox"
                      checked={profile.data.notiInvited}
                      onChange={handleChecked}>
                    </Form.Check>
                  </td>
                </tr>
                <tr>
                  <td>
                    Новые сообщения
                  </td>
                  <td>
                    <Form.Check
                      name="notiMessage"
                      type="checkbox"
                      checked={profile.data.notiMessage}
                      onChange={handleChecked}>
                    </Form.Check>
                  </td>
                </tr>
                <tr>
                  <td>
                    Новые заявки клиентов
                  </td>
                  <td>
                    <Form.Check
                      name="notiAsk"
                      type="checkbox"
                      checked={profile.data.notiAsk}
                      onChange={handleChecked}>
                    </Form.Check>
                  </td>
                </tr>
                <tr>
                  <td>
                    Получать заявки от физ.лиц
                  </td>
                  <td>
                    <Form.Check
                      name="getAskFromFiz"
                      type="checkbox"
                      checked={profile.data.getAskFromFiz}
                      onChange={handleChecked}>
                    </Form.Check>
                  </td>
                </tr>
              </tbody>
            </Table>
            <button
              className="myButtonMessage"
              onClick={onSubmit}
            >
              Сохранить
            </button>
          </Col>
        </Row>
      </Container>
      <ModalCT
        header="Регионы"
        active={modalActiveReg}
        setActive={setModalActiveReg}
        text={
          <div className='mx-3 pb-2 text-warning'>
            Не более 3
          </div>
        }
        component={<RegionTree
          checked={checkedRegion} expanded={expandedRegion} max={4}
          setChecked={setCheckedRegion} setExpanded={setExpandedRegion}
        />} />
      <ModalCT
        header="Категории"
        active={modalActiveCat}
        setActive={setModalActiveCat}
        text={
          <div className='mx-3 pb-2 text-warning'>
            Не более 3
          </div>
        }
        component={<CategoryTree
          checked={checkedCat} expanded={expandedCat} max={4}
          setChecked={setCheckedCat} setExpanded={setExpandedCat}
        />} />
    </div>
  );
});

export default Profile;