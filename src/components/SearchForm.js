import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Spinner,
    ListGroup,
    Card,
    InputGroup
} from "react-bootstrap";
import '../style.css';
import '../searchForm.css';
import ModalCT from './ModalCT';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import CategoryTree from './CategoryTree';
import RegionTree from './RegionTree';
import { getCategoryName } from '../utils/Convert'
import { categoryNodes } from '../config/Category';
import { regionNodes } from '../config/Region';
import { PlusCircle, DashCircle, ChevronDown } from 'react-bootstrap-icons';
import { Context } from "../index";
import PriceService from '../services/PriceService'
import CarouselService from '../services/CarouselService'
import { Search, X } from 'react-bootstrap-icons';

const SearchForm = () => {
    const { ask } = useContext(Context);
    const [visible, setVisible] = useState(false);
    const [modalActiveCat, setModalActiveCat] = useState(false);
    const [modalActiveReg, setModalActiveReg] = useState(false);
    const [checkedRegion, setCheckedRegion] = useState([]);
    const [expandedRegion, setExpandedRegion] = useState([]);
    const [checkedCat, setCheckedCat] = useState([]);
    const [expandedCat, setExpandedCat] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchInn, setSearchInn] = useState("");
    const inputText = useRef(null);
    const inputInn = useRef(null);
    const wrapperRef = useRef(null);
    ///
    const [suggestionsText, setSuggestionsText] = useState([]);
    const [showDropdownText, setShowDropdownText] = useState(false);
    const [loadingText, setLoadingText] = useState(false);
    ///
    const [suggestionsInn, setSuggestionsInn] = useState([]);
    const [showDropdownInn, setShowDropdownInn] = useState(false);
    const [loadingInn, setLoadingInn] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdownText(false);
                setShowDropdownInn(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Очищаем предыдущий таймер
        const timer = setTimeout(() => {
            if (searchText.length < 2) {
                setSuggestionsText([]);
                setShowDropdownText(false);
                return;
            }
            const fetchSuggestions = async () => {
                setLoadingText(true);
                try {
                    const response = await PriceService.getFilterPrice({
                        filterCat: ask.categoryFilter,
                        filterRegion: ask.regionFilter,
                        searchText: searchText,
                        searchInn: ask.searchInn,
                        startDate: null,
                        endDate: null,
                        limit: 10,
                        page: 1,
                    });

                    setSuggestionsText(response.docs || []);
                    setShowDropdownText(response.docs?.length > 0);
                } catch (err) {
                    console.error('Ошибка получения подсказок:', err);
                    setSuggestionsText([]);
                    setShowDropdownText(false);
                } finally {
                    setLoadingText(false);
                }
            };

            fetchSuggestions();
        }, 400);

        return () => clearTimeout(timer);
    }, [searchText]);

    useEffect(() => {
        // Очищаем предыдущий таймер
        const timer = setTimeout(() => {
            if (searchInn.length < 2) {
                setSuggestionsInn([]);
                setShowDropdownInn(false);
                return;
            }
            const fetchSuggestions = async () => {
                setLoadingInn(true);
                try {
                    const response = await CarouselService.getCarousel({
                        filterCat: ask.categoryFilter,
                        filterRegion: ask.regionFilter,
                        searchInn: searchInn,
                        limit: 10,
                        page: 1,
                    })

                    setSuggestionsInn(response.docs || []);
                    setShowDropdownInn(response.docs?.length > 0);
                    console.log(response.docs)
                } catch (err) {
                    console.error('Ошибка получения контрагентов:', err);
                    setSuggestionsInn([]);
                    setShowDropdownInn(false);
                } finally {
                    setLoadingInn(false);
                }
            };

            fetchSuggestions();
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInn]);

    useEffect(() => {
        ask.categoryFilter = checkedCat;
        ask.regionFilter = checkedRegion;
    }, [checkedCat, checkedRegion]);

    const handleSelectText = (e, item) => {
        e.preventDefault()
        ask.setSearchText(item.name)
        ask.setSearchInn(searchInn)
        setShowDropdownText(false)
        inputText.current.value = item.name
    };

    const handleSelectInn = (e, item) => {
        e.preventDefault()
        ask.setSearchText(searchText)
        ask.setSearchInn(item.name)
        setShowDropdownInn(false)
        inputInn.current.value = item.name
    };

    const desktop = () => {
        return (
            <div>
                <div className="searchForm">
                    <Row>
                        <Form.Group as={Col}>
                            <InputGroup className="mb-3 position-relative">
                                <Form.Control
                                    type="search"           // ← лучше семантика
                                    placeholder="Наименование или код товара"
                                    ref={inputText}
                                    value={searchText}      // ← controlled input — надёжнее
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onFocus={() => suggestionsText.length > 0 && setShowDropdownText(true)}
                                />

                                {/* Крестик очистки */}
                                {searchText && (
                                    <button
                                        type="button"
                                        className="btn-clear position-absolute top-50 translate-middle-y"
                                        style={{ right: '50px', zIndex: 5, background: 'transparent', border: 'none' }}
                                        onClick={() => {
                                            setSearchText('');
                                            inputText.current?.focus(); // удобно — фокус остаётся
                                        }}
                                        aria-label="Очистить"
                                    >
                                    </button>
                                )}

                                {/* Лупа — кнопка поиска */}
                                <button
                                    type="button"
                                    className="btn-search position-absolute top-50 translate-middle-y"
                                    style={{ right: '12px', zIndex: 5, background: 'transparent', border: 'none', padding: 0 }}
                                    onClick={() => {
                                        ask.setSearchText(searchText);
                                        ask.setSearchInn(searchInn);
                                    }}
                                    aria-label="Поиск"
                                >
                                    <Search size={20} color="#6c757d" />
                                </button>

                                {/* Подсказки */}
                                {showDropdownText && (
                                    <ListGroup
                                        className="position-absolute w-100 shadow dropdown-menu show" // ← стили как у dropdown
                                        style={{ top: '100%', zIndex: 1000, marginTop: '4px' }}
                                        ref={wrapperRef}
                                    >
                                        {loadingText ? (
                                            <ListGroup.Item disabled>Загрузка...</ListGroup.Item>
                                        ) : (
                                            suggestionsText.map((item) => (
                                                <ListGroup.Item
                                                    key={item.id || item.code}
                                                    action
                                                    onClick={(e) => handleSelectText(e, item)}
                                                    className="py-2"
                                                >
                                                    {item.name.substring(0, 100)}
                                                </ListGroup.Item>
                                            ))
                                        )}
                                    </ListGroup>
                                )}
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <InputGroup className="mb-3 position-relative">
                                <Form.Control
                                    type="search"           // ← лучше семантика
                                    placeholder="Наименование или ИНН заказчика"
                                    ref={inputInn}
                                    value={searchInn}       // ← controlled input
                                    onChange={(e) => setSearchInn(e.target.value)}
                                    onFocus={() => suggestionsInn.length > 0 && setShowDropdownInn(true)}
                                />

                                {/* Крестик очистки */}
                                {searchInn && (
                                    <button
                                        type="button"
                                        className="btn-clear position-absolute top-50 translate-middle-y"
                                        style={{ right: '50px', zIndex: 5, background: 'transparent', border: 'none' }}
                                        onClick={() => {
                                            setSearchInn('');
                                            inputInn.current?.focus(); // удобно — фокус остаётся
                                        }}
                                        aria-label="Очистить"
                                    >
                                    </button>
                                )}

                                {/* Лупа — кнопка поиска */}
                                <button
                                    type="button"
                                    className="btn-search position-absolute top-50 translate-middle-y"
                                    style={{ right: '12px', zIndex: 5, background: 'transparent', border: 'none', padding: 0 }}
                                    onClick={() => {
                                        ask.setSearchInn(searchInn);
                                        ask.setSearchText(searchText);
                                    }}
                                    aria-label="Поиск"
                                >
                                    <Search size={20} color="#6c757d" />
                                </button>

                                {/* Подсказки */}
                                {showDropdownInn && (
                                    <ListGroup
                                        className="position-absolute w-100 shadow dropdown-menu show"
                                        style={{ top: '100%', zIndex: 1000, marginTop: '4px' }}
                                        ref={wrapperRef}
                                    >
                                        {loadingInn ? (
                                            <ListGroup.Item disabled>Загрузка...</ListGroup.Item>
                                        ) : (
                                            suggestionsInn.map((item) => (
                                                <ListGroup.Item
                                                    key={item._id || item.code}
                                                    action
                                                    onClick={(e) => handleSelectInn(e, item)}
                                                    className="py-2"
                                                >
                                                    <div className="d-flex align-items-center">
                                                        {item?.logo?.filename ? (
                                                            <img
                                                                className="avatarSuggestion me-2"
                                                                src={`${process.env.REACT_APP_API_URL}getlogo/${item.logo.filename}`}
                                                                alt={item.name || ''}
                                                                style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px' }}
                                                            />
                                                        ) : null}
                                                        <div>
                                                            <div>{item.name?.substring(0, 100)}</div>
                                                            <div className="text-muted small">{item.nameOrg?.substring(0, 100)}</div>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                            ))
                                        )}
                                    </ListGroup>
                                )}
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} controlId="Tree">
                            <InputGroup className="mb-3 position-relative">
                                <Form.Control
                                    type="text"
                                    placeholder="Классификатор"
                                    readOnly
                                    value={getCategoryName(checkedCat, categoryNodes).join(", ")}
                                />

                                {/* Крестик очистки — появляется, если есть выбранные */}
                                {checkedCat.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn-clear position-absolute top-50 translate-middle-y"
                                        style={{ right: '50px', zIndex: 5, background: 'transparent', border: 'none' }}
                                        onClick={() => setCheckedCat([])}
                                        aria-label="Очистить выбранные категории"
                                    >
                                        <X size={20} color="#6c757d" />
                                    </button>
                                )}

                                {/* Кнопка открытия модалки/дерева — иконка справа */}
                                <button
                                    type="button"
                                    className="btn-search position-absolute top-50 translate-middle-y"
                                    style={{ right: '12px', zIndex: 5, background: 'transparent', border: 'none', padding: 0 }}
                                    onClick={() => setModalActiveCat(true)}
                                    aria-label="Выбрать классификатор"
                                >
                                    <ChevronDown size={20} color="#6c757d" />
                                </button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group as={Col} controlId="Tree">
                            <InputGroup className="mb-3 position-relative">
                                <Form.Control
                                    type="text"
                                    placeholder="Регионы"
                                    readOnly
                                    value={getCategoryName(checkedRegion, regionNodes).join(", ")}
                                />

                                {/* Крестик очистки — появляется, если есть выбранные регионы */}
                                {checkedRegion.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn-clear position-absolute top-50 translate-middle-y"
                                        style={{ right: '50px', zIndex: 5, background: 'transparent', border: 'none' }}
                                        onClick={() => setCheckedRegion([])}
                                        aria-label="Очистить выбранные регионы"
                                    >
                                        <X size={20} color="#6c757d" />
                                    </button>
                                )}

                                {/* Кнопка открытия модалки/списка регионов */}
                                <button
                                    type="button"
                                    className="btn-search position-absolute top-50 translate-middle-y"
                                    style={{ right: '12px', zIndex: 5, background: 'transparent', border: 'none', padding: 0 }}
                                    onClick={() => setModalActiveReg(true)}
                                    aria-label="Выбрать регионы"
                                >
                                    <ChevronDown size={20} color="#6c757d" />
                                    {/* Если предпочитаешь оставить три точки как было: */}
                                    {/* <span style={{ fontSize: '18px', fontWeight: 600 }}>...</span> */}
                                </button>
                            </InputGroup>
                        </Form.Group>
                    </Row>
                </div>
                <ModalCT
                    header="Регионы"
                    active={modalActiveReg}
                    setActive={setModalActiveReg}
                    component={<RegionTree
                        checked={checkedRegion} expanded={expandedRegion} max={999}
                        setChecked={setCheckedRegion} setExpanded={setExpandedRegion}
                    />} />
                <ModalCT
                    header="Категории"
                    active={modalActiveCat}
                    setActive={setModalActiveCat}
                    component={<CategoryTree
                        checked={checkedCat} expanded={expandedCat} max={999}
                        setChecked={setCheckedCat} setExpanded={setExpandedCat}
                    />} />
            </div>
        )
    }

    const mobile = () => {
        return (
            <Card className='section'>
                <Card.Header className='sectionHeaderSearch headerAsks'
                    onClick={() => setVisible(!visible)}>
                    {visible ?
                        <DashCircle className='caret' />
                        :
                        <PlusCircle className='caret' />
                    }
                    &nbsp;Поиск
                </Card.Header>
                {visible ?
                    <Form className="searchForm">
                        <Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <InputGroup className="mb-3">
                                    <Form.Control type="nameOrder" placeholder="Наименование или текст закупки"
                                        onChange={(e) => setSearchText(e.target.value)} />
                                    <Button variant="outline-secondary" id="button-addon2"
                                        onClick={() => {
                                            ask.setSearchText(searchText)
                                            ask.setSearchInn(searchInn)
                                        }}>
                                        <Search color="black" style={{ "width": "20px", "height": "20px" }} />
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <InputGroup className="mb-3">
                                    <Form.Control type="nameClient" placeholder="Наименование или ИНН заказчика"
                                        onChange={(e) => setSearchInn(e.target.value)} />
                                    <Button variant="outline-secondary" id="button-addon2"
                                        onClick={() => {
                                            ask.setSearchInn(searchInn)
                                            ask.setSearchText(searchText)
                                        }}>
                                        <Search color="black" style={{ "width": "20px", "height": "20px" }} />
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} controlId="Tree">
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        placeholder="Классификатор"
                                        value={getCategoryName(checkedCat, categoryNodes).join(", ")}
                                    />
                                    <Button variant="outline-secondary" id="button-addon2" onClick={() => setModalActiveCat(true)}>
                                        ...
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} controlId="Tree">
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        placeholder="Регионы"
                                        value={getCategoryName(checkedRegion, regionNodes).join(", ")}
                                    />
                                    <Button variant="outline-secondary" id="button-addon2" onClick={() => setModalActiveReg(true)}>
                                        ...
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                    </Form>
                    :
                    <div></div>
                }
                <ModalCT
                    header="Регионы"
                    active={modalActiveReg}
                    setActive={setModalActiveReg}
                    component={<RegionTree
                        checked={checkedRegion} expanded={expandedRegion} max={999}
                        setChecked={setCheckedRegion} setExpanded={setExpandedRegion}
                    />} />
                <ModalCT
                    header="Категории"
                    active={modalActiveCat}
                    setActive={setModalActiveCat}
                    component={<CategoryTree
                        checked={checkedCat} expanded={expandedCat} max={999}
                        setChecked={setCheckedCat} setExpanded={setExpandedCat}
                    />} />
            </Card>
        )
    }

    return (
        window.innerWidth > 650 ?
            desktop()
            :
            mobile()
    )
};

export default SearchForm;