import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from "./ReportWrapper.module.scss";
import Close from "../../img/close.png";
import Moment from "react-moment";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


const Img = ({src}) => {
    const [close, setClose] = useState(true);


    return (

        close ? <img
                alt="Пусто"
                onClick={() => setClose(false)}
                src={src}
            /> : <div className={styles.fullImg}>
            <header >
                <img src={Close} alt="" onClick={() => setClose(true)}/>
            </header>
            {/* <TransformWrapper> */}
                {/* <TransformComponent> */}
                    <img
                        alt="that wanaka tree"

                        src={src}
                    />
                {/* </TransformComponent> */}
            {/* </TransformWrapper> */}
        </div>






    )
};


const ReportWrapper = ({req, func}) => {

    return (
        <div className={styles.ReportWrapper}>
            <header><p>Отчет {req[8] === 'СО' ? 'Снятие Объемов' : req[8]}</p> <img src={Close} alt="" onClick={() => func()}/></header>
            <div className={styles.report}>
                <p>Начало:  <span><Moment format={'HH:mm:ss'}>{req[5]}</Moment></span></p>
                <p>Завершение:  <span><Moment format={'HH:mm:ss'}>{req[6]}</Moment></span></p>
                <p>Был:  <span>{req[9]}</span></p>
                <p>Комментарий: {req[12] ? <span>{req[12]}</span> : null} {req[15] ? <span>{req[15]}</span> : null}</p>
                <p className={styles.photo}>Фотографии </p>
            </div>

            {req[24] !== '0' ? <div className={styles.req_images}>

                {req[24].split(';').map(el => <Img key={el} src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[0]}/${el}`} alt=""/>
                )}

            </div> : <div> {req[18] === 'Заявка выполнена' && req[8] === 'Заявка' ? <div className={styles.req_images}>

                <Img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/АКТ.png`} alt=""/>

                <Img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/Фото_АКБ.png`} alt=""/>

                <Img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/Осмотр_объекта.png`} alt=""/>

                <Img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/Пломба.png`} alt=""/>

                <Img src={`https://volga24bot.com/kartoteka/api/tech/uploaded_files/${req[1]}/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[25]}/Неисправность.png`} alt=""/>
            </div> : null}
                {req[18] === 'Выполнено' && req[8] === 'СО' ? <div className={styles.req_images}>

                    <Img src={`https://volga24bot.com/kartoteka/api/tech/tz/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[2].replace( /\s/g, "")}/Тз1.png`}/>
                    <Img src={`https://volga24bot.com/kartoteka/api/tech/tz/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[2].replace( /\s/g, "")}/Тз2.png`}/>

                </div> : null}
                {req[18] === 'Завершен' && req[8] === 'Монтаж' ? <div className={styles.req_images}>

                    <Img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[0]}/Акт_выполненных_работ.png`} alt=""/>

                    <Img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[0]}/Анкета.png`} alt=""/>

                    <Img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[0]}/Фасад.png`} alt=""/>

                    <Img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[0]}/Схема.png`} alt=""/>

                    <Img src={`https://volga24bot.com/kartoteka/api/tech/montazh/${req[0]}/Пломба.png`} alt=""/>
                </div> : null}
                {req[18] === 'Завершено' && req[8] === 'ТО' ? <div className={styles.req_images}>

                    <Img src={`https://volga24bot.com/kartoteka/api/tech/to/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[0]}/Фото1.png`} alt=""/>

                    <Img src={`https://volga24bot.com/kartoteka/api/tech/to/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[0]}/Фото2.png`} alt=""/>

                    <Img src={`https://volga24bot.com/kartoteka/api/tech/to/${req[23].substr(8,2)}.${req[23].substr(5,2)}.${req[23].substr(0,4)}/${req[0]}/Фото3.png`} alt=""/>
                </div> : null}</div>}


        </div>
    );
}



export default ReportWrapper;
