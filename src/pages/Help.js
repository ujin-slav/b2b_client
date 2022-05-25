import React from 'react';
import {Container} from "react-bootstrap";

const Help = () => {
    return (
        <div>
            <Container className="mx-auto my-4" style={{"width":"80%"}}>
            <div>
                    <ul>
                    <li><a href="#reg">Регистрация.</a></li>
                    <li><a href="#create">Создание заявки.</a></li>
                    <li><a href="#change">Выбор участников.</a></li>
                    <li><a href="#copy">Как поделится ссылкой на заявку.</a></li>
                    <li><a href="#del">Удаление заявки.</a></li>
                    <li><a href="#search">Поиск клиентов.</a></li>
                    <li><a href="#profile">Изменение учетных данных.</a></li>
                    <li><a href="#ask">Задать вопрос по заявке.</a></li>
                    <li><a href="#delask">Удалить свой вопрос.</a></li>
                    <li><a href="#offer">Сделать предложение по заявке.</a></li>
                    <li><a href="#deloffer">Удалить предложение.</a></li>
                    </ul>
                    <a name="reg" /><h3>1.Регистрация</h3>
                    <p>Для начала работы с
                    сервисом первым делом необходимо пройти процедуру регистрации.</p>
                    <p>Для этого нажимает
                    кнопку войти правом верхнем углу экрана.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m1c49b486.png`} 
                    name="Графический объект1" align="BOTTOM" width={427} height={61} border={0} /></p>
                    <p>Форма регистрации не
                    отличается от большинства сайтов, стоит корректно заполнить название,
                    инн, адрес вашей организации, покупатели будут видеть эти данные и
                    если они будут не корректны могут отказаться от сделки.</p>
                    <p>Также стоит
                    заполнить поле “Регион” и “Категория” они
                    будут автоматически подставляться в создаваемых вами заявках на
                    покупку, по региону поставки и категории товара или услуги поставщики
                    смогут найти вашу заявку и предложить вам наилучшую цену.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_209feb67.png`} name="Графический объект2" align="BOTTOM" width={623} height={165} border={0} /></p>
                    <a name="create" /><h3>2. Создаем заявку на покупку.</h3>
                    <p>Нажимаем создать
                    заявку.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_56558ade.png`} name="Графический объект3" align="BOTTOM" width={347} height={64} border={0} /></p>
                    <p>Указываем название
                    заявки, например “Закупка стройматериалов”.</p>
                    <p>Указываем дату и
                    время окончания подачи предложений, т.е до этого времени поставщики
                    смогут подать свои предложения, далее заявка уже будет не актуальна.</p>
                    <a name="change" /><p>Далее вы можете
                    выбрать участников.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m68509c5d.png`} name="Графический объект4" align="BOTTOM" width={624} height={147} border={0} /></p>
                    <p>Можно оставить поле
                    пустым и тогда предложения смогут делать любые участники сервиса.</p>
                    <a name="copy" /><p>Скопировать ссылку
                    можно нажав на значок ссылки.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m790677f5.png`} name="Графический объект5" align="BOTTOM" width={454} height={40} border={0} /></p>
                    <p>В поле текст заявки
                    указываете что желаете приобрести, либо можно написать что ваша
                    заявка находится в прикрепленном файле(например она в рукописном виде
                    на фото).</p>
                    <p>В поле контактные
                    данные информация берется из ваших учетных данных, также вы можете
                    отредактировать или добавить необходимую информацию.</p>
                    <a name="profile" /><p>Изменить учетные
                    данные в можете в разделе профиль в правом верхнем углу.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m6d0d3c16.gif`} name="Графический объект6" align="LEFT" width={120} height={62} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                    <p>Категории и регионы
                    также подставляются из учетных данных, оставлять их пустыми не
                    рекомендуется, поэтому если заявка предназначена не для специального
                    круга пользователей потенциальные поставщики не смогут ее найти.</p>
                    <p><br /><br />
                    </p>
                    <p>В поле файлы вы
                    можете прикрепить заявку в формате doc,<span lang="en-US">xls</span>,pdf,jpg
                    также чертежи или другую поясняющую информацию, договор, или уже
                    выставленный кем то счет для того чтобы участники могли
                    ориентироваться по ценам и необходимым позициям.</p>
                    <p><br /><br />
                    </p>
                    <p> <img src={`${process.env.REACT_APP_API_URL}static/help/1_html_mda2db78.gif`} name="Графический объект7" align="LEFT" width={624} height={70} border={0} /><br clear="LEFT" />
                    </p>
                    <p>В поле комментарий
                    вы может указать с какой целью производится закупка, например:
                    «ремонт покрасочного цеха» по этим комментариям вы
                    сможете легко ориентироваться в разделе «Мои закупки»</p>
                    <p>После того как
                    заявка создана она начинает отображаться в поиске:</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_5d4a9dab.gif`} name="Графический объект8" align="LEFT" width={624} height={169} border={0} /><br clear="LEFT" />Пользователи
                    могут задать вам вопрос, после этого в разделе «Вопрос-ответ»
                    загорится непрочитанное сообщение 
                    </p>
                    <p>А<img src={`${process.env.REACT_APP_API_URL}static/help/1_html_131343fd.gif`} name="Графический объект9" align="LEFT" width={245} height={65} border={0} /><br clear="LEFT" />
                    в самом разделе появиться сообщение 
                    </p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m562af411.gif`} name="Графический объект10" align="LEFT" width={624} height={43} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                    <p>нажав на которое вы
                    сможете переместиться в саму заявку и ответить на вопрос 
                    </p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m5a06212d.gif`} name="Графический объект11" align="LEFT" width={556} height={221} border={0} /><br clear="LEFT" />Также
                    пользователи могу отправлять вам личные сообщение 
                    </p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m39bd396e.gif`} name="Графический объект12" align="LEFT" width={603} height={178} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                    <p>Новые непрочитанные
                    сообщение будут загораться в разделе «Сообщения»</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m61691521.gif`} name="Графический объект13" align="LEFT" width={251} height={61} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m6e6c8bdd.gif`} name="Графический объект14" align="LEFT" width={329} height={273} border={0} /><br clear="LEFT" />Вы
                    можете зайти в раздел и ответить, работа в данном разделе не
                    отличается от любого мессенджера.</p>
                    <p><br /><br />
                    </p>
                    <a name="del" /><p>Чтобы удалить заявку
                    нужно перейти в раздел “Мои заявки” и у заявки которую
                    хотите удалить нажать красный крестик.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_313f9dc0.png`} name="Графический объект15" align="BOTTOM" width={623} height={18} border={0} /></p>
                    <a name="search" /><h3>3.Поиск клиентов</h3>
                    <p>Выбрав в
                    «Классифиактор»  нужную категорию товаров или услуг
                    которые требуются покупателям</p>
                    <p>и регион в котором
                    производится закупка можно отсортировать таблицу.</p>
                    <p><br /><br />
                    </p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_1f0699c0.gif`} name="Графический объект16" align="LEFT" width={624} height={54} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                    <p>Также можно
                    произвести поиск по тексту или наименованию закупки и произвести
                    сортировку по отдельной организации.</p>
                    <p>После того как вы
                    нашли интересующую вас закупку нажимайте на строку таблицы 
                    </p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_3cd9f675.png`} name="Графический объект17" align="LEFT" width={624} height={132} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                    <p><br /><br />
                    </p>
                    <a name="offer"><p>В самом низу
                        страницы есть возможность сделать предложение , укажите цену,
                        напишете сообщение(не обязательно) прикрепите файлы(файл счета, фото
                        продукции, сертификат и тд), файлы также прикреплять не обязательно.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m44a5d107.gif`} name="Графический объект18" align="LEFT" width={589} height={378} border={0} /><br clear="LEFT" />Ваши
                        предложения будут видны в разделе «Мои предложения»</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_45e18147.gif`} name="Графический объект19" align="LEFT" width={299} height={62} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                    <img src={`${process.env.REACT_APP_API_URL}static/help/1_html_54229ab3.gif`} name="Графический объект20" align="LEFT" width={624} height={58} border={0} /><br clear="LEFT" /><br /><br />
                    </a><a name="deloffer" /><p>В этом разделе вы
                    можете удалить свое предложение.</p>
                    <a name="ask" /><p>Также вы можете
                    задать вопрос покупателю.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m74567a9.gif`} name="Графический объект21" align="LEFT" width={624} height={121} border={0} /><br clear="LEFT" />Либо
                    отправить сообщение в личный чат 
                    </p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_m36975ee.gif`} name="Графический объект22" align="LEFT" width={624} height={149} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                    <p>Заданные вами
                    вопросы находятся в разделе «Вопрос-ответ»</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_4e41b1f6.gif`} name="Графический объект23" align="LEFT" width={253} height={63} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                    <a name="delask" /><p>Если перейти в
                    заявку то можно удалить свой вопрос нажав на красный крестик в правом
                    верхнем углу.</p>
                    <p><img src={`${process.env.REACT_APP_API_URL}static/help/1_html_37c4776c.gif`} name="Графический объект24" align="LEFT" width={624} height={38} border={0} /><br clear="LEFT" /><br /><br />
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default Help;