import React, { useEffect, useState } from 'react';
import { useStore } from "effector-react";
import moment from 'moment';

import styles from './PopUp.module.scss';

import { $user } from "../../../state/user";
import { $usersStatus } from "../../../state/getUsers";
import { $today } from "../../../state/tasks";
import { getAllReq, getNewReq } from "../../../state";
import { setHistory } from "../../../actions/setHistory";
import Transfers from './serviceTransfers';

import Close from '../../../img/close.png'

const times = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

function declOfNum(n, text_forms) {
  n = Math.abs(n) % 100;
  var n1 = n % 10;
  if (n > 10 && n < 20) { return text_forms[2]; }
  if (n1 > 1 && n1 < 5) { return text_forms[1]; }
  if (n1 == 1) { return text_forms[0]; }
  return text_forms[2];
}

const imMessageAdd = (chatId, message, isSystem = true) => {
  window.bx24?.callMethod('im.message.add', {
    'DIALOG_ID': chatId,
    'MESSAGE': message,
    'SYSTEM': isSystem ? 'Y' : "N",
  });
}


const TechItem = ({ item, func, func2, task, checked, techs, all, tasksToday, setCoef, datepicker }) => {
  const [tasks, setTasks] = useState([]);
  const [htmlItem, setHtmlItem] = useState(<span>0</span>)
  useEffect(() => {

    fetch(`https://volga24bot.com/kartoteka/api/tech/planing/getPlane.php?tech=${item.LAST_NAME}&date=${datepicker}&type=date`)
      .then(res => res.json())
      .then(tasks => {

        if (tasks) {
          setTasks(tasks)
          let seconds = 0;
          tasks.forEach(el => {
            const time = el[59] * 60 * 60
            seconds += time;
          })
          if (checked && !all) {

            let deadline = task[34] / techs.length

            if (deadline <= 9) {
              seconds += deadline * 60 * 60
            } else {
              seconds += 9 * 60 * 60
            }
          } else if (checked && all) {
            tasksToday.forEach(el => {
              let deadline = el[34] / techs.length

              if (deadline <= 9) {
                seconds += deadline * 60 * 60
              } else {
                seconds += 9 * 60 * 60
              }
            })
          }

          let coef = seconds * 100 / 28800;

          setCoef(coef.toFixed(0), item.ID)
          if (coef.toFixed(0) >= 100) {
            setHtmlItem(<span style={{ color: 'red', fontWeight: 500 }}>{coef.toFixed(0)}%</span>)
          } else {
            setHtmlItem(<span style={{ color: 'green', fontWeight: 500 }}>{coef.toFixed(0)}%</span>)
          }
        }
      })
      .catch(function (res) { console.log(res) })
  }, [checked, all, datepicker, techs]);


  return (
    <div className={styles.techWrapper}>
      <label>
        <input type="checkbox" onChange={(e) => {
          if (e.target.checked) {
            func()
          } else {
            func2()
          }
        }} />
        {item.LAST_NAME}
      </label>
      <div className={styles.flex}>
        <p>Задач:  <span>{tasks.length}</span></p>
        <p>КПД: {htmlItem}</p>
      </div>
    </div>
  )
}

const PopUp = ({ item, time, close }) => {
  const users = useStore($usersStatus)
  const techs = item[34] / 8 <= 1 ? 1 : item[34] / 8 > 2 ? 3 : 2;
  const today = useStore($today);
  const user = useStore($user)
  const [coef, setCoef] = useState([]);
  const datePlane = item[51].split(' ');
  const [form, setForm] = useState({
    datepicker: item[61] === 'Y' ? moment(datePlane[0]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    typetime: item[61] === 'Y' ? 'fixed' : 'without',
    time: item[61] === 'Y' ? datePlane[1] : '07:00',
    techs: [],
    all: false
  })
  const admins = ['1', '11', '33', '29', '23', '53', '317', '109', '147', '3503', '3707', '83', '211', '3745', '3759', '3763'];

  const lowleveltech = ['Трусов Егор Владимирович'];

  const handleSubmit = async (date, time, type, techs, all, id, coefs) => {
    if (techs.length) {

      let data = new FormData();
      let deadline = item[34] / techs.length

      data.append('date', date)
      data.append('time', time)
      data.append('deadline', deadline <= 9 ? deadline : 9)
      data.append('type', type)


      // if (admins.includes(user.ID) === false) {
      //   alert('Вы не можете планировать!');
      //   close();
      //   return;
      // }

      if ((new Date(date + 'T' + time).getTime() > Date.now()) === false) {
        alert('Запланированное время не может быть меньше текущего!');
        return;
      }

      const maxTime = 8 * 3;
      for (const fio of techs) {
        const res = await fetch('https://volga24bot.com/kartoteka/api/crm/taskByTech.php?fio=' + fio.split(' ')[0])
          .then(res => res.json());
        var sumTime = 0;
        for (const item of res) sumTime += +item.timeJob;
        if (sumTime > maxTime) {
          alert(`На ${fio} назначено уже ${sumTime} часов работы, на него больше нельзя ставить задачи.`);
        }
      }

      if (lowleveltech.includes(item[42]) && item[8] === 'СО') {
        alert('Этот техник не может выполнять снятие объемов.');
        return;
      }

      if (item[48] === '1') {
        if (item[42]) {
          if (techs.includes(item[42]) === false) {
            alert(`Заявка была запланирована на ${item[42]}, поэтому этот техник также должен быть выбран.`);
            return;
          }
        }
      }
      data.append('techs', techs.join(','))
      data.append('id', id)
      data.append('creatorId', user.ID)
      data.append('ids', all ? today.filter(el => el[8] === item[8] && el[3] === item[3]).map(el => el[0]) : '')

      if (item[55] !== techs.join(', ')) {
        const message = ` ${item[47]} ${item[2]} ${item[4]} перенаправлена ${item[55] && `c ${item[55].split(' ')[0]}`} на ${techs.map(t => t.split(' ')[0]).join(', ')}`;

        Transfers.create('transfers', message);
        // imMessageAdd('chat11871', message);
        imMessageAdd('3745', message);
      } else if (item[52]) {
        const move = JSON.parse(item[52]).filter(t => t.type === "plane_change");

        if (move?.length >= 1) {
          const message = ` ${item[47]} ${item[2]} ${item[4]} перенесена уже ${move.length + 1} раз`;

          Transfers.create('move', message);
          // imMessageAdd('chat11871', message);
          imMessageAdd('3745', message);
        }
      }

      fetch('https://volga24bot.com/kartoteka/api/tech/planing/setPlane.php', {
        method: "POST",
        body: data
      })
        .then(res => res.json())
        .then(res => {
          if (res === 'success') {
            setHistory(id, 'plane_change', `Задача запланирована на ${type === 'fixed' ? `${moment(date).format('DD.MM')} ${time}` : `${moment(date).format('DD.MM')}`}. Пользователем: ${user.LAST_NAME}`, '', () => alert('Задача запланирована успешно!'));
            getAllReq();
            close()
          } else {
            alert('Произошла ошибка')
          }
        })
        .catch(function (res) { console.log(res) })
    } else {
      alert('Выберите хотябы 1 техника!');
    }
  }


  //console.log(form)


  return (
    <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>

      <div className={styles.popUpWrapper}>
        <div className={styles.closeWrapper} onClick={(e) => {
          e.stopPropagation()
          close(false)
        }}><img src={Close} alt="" /></div>
        <div className={styles.block}>
          <p className={styles.title}>Информация</p>
          <p className={`${styles.red}`}>{item[3] ? item[3] : item[8]}</p>
          <p>{item[2]}</p>
          <p>{item[4]}</p>
        </div>
        <div className={styles.block}>
          <p className={styles.title}>Рекомендации</p>
          <p>Время на работу: <b>{item[34] === '0' ? 'Время отсутствует!' : time}</b></p>
          <p>Рекомендуемое число техников: <b>{item[34] === '0' ? 'Неизвестно!' : techs}</b></p>
        </div>

        {item[61] !== 'Y' ? <div className={`${styles.block} ${styles.flex}`}>
          <div>
            <p className={styles.title}>Дата</p>
            <label>
              <input type="date" value={form.datepicker} onChange={(e) => setForm(({ ...form, datepicker: e.target.value }))} className={styles.input} />
            </label>
          </div>
          <div>
            <p className={styles.title}>Время</p>
            <label>
              <select name="typepeacker" className={styles.input} value={form.typetime} onChange={(e) => {
                if (e.target.value === 'fixed') {

                  setForm(({ ...form, typetime: e.target.value, all: false }))
                } else {
                  setForm(({ ...form, typetime: e.target.value }))
                }
              }}>
                <option value="without">Без времени</option>
                <option value="from">С</option>
                <option value="to">До</option>
                <option value="fixed">Фикс.</option>
              </select>
            </label>
            {form.typetime !== 'without' ? <label>
              <select name="timepeacker" className={styles.input} value={form.time} onChange={(e) => setForm(({ ...form, time: e.target.value }))}>
                {times.map(el => <option value={el} key={el}>{el}</option>)}
              </select>
            </label> : null}
          </div>


        </div> : null}
        <div className={styles.block}>
          <p className={styles.title}>Техники</p>
          {users.find(el => +el.DEP === user.UF_DEPARTMENT[0]) ? users.find(el => +el.DEP === user.UF_DEPARTMENT[0]).OTHER?.map(el =>
            <TechItem
              item={el}
              key={el.ID}
              func={() => setForm(({ ...form, techs: [...form.techs, `${el.LAST_NAME} ${el.NAME} ${el.SECOND_NAME}`] }))}
              func2={() => setForm(({ ...form, techs: form.techs.filter(el2 => el2 !== `${el.LAST_NAME} ${el.NAME} ${el.SECOND_NAME}`) }))}
              task={item}
              checked={form.techs.filter(el2 => el2 === `${el.LAST_NAME} ${el.NAME} ${el.SECOND_NAME}`).length}
              techs={form.techs}
              all={form.all}
              tasksToday={today.filter(el2 => el2[8] === item[8] && el2[3] === item[3])}
              setCoef={(c, name) => setCoef(prevState => {
                const newArr = prevState.filter(names => names.name !== name)
                return [...newArr, { name: name, coef: c }]
              })}
              datepicker={form.datepicker}
            />) : users.find(el => +el.DEP === 5)?.OTHER?.map(el =>
              <TechItem
                item={el}
                key={el.ID}
                func={() => setForm(({ ...form, techs: [...form.techs, `${el.LAST_NAME} ${el.NAME} ${el.SECOND_NAME}`] }))}
                func2={() => setForm(({ ...form, techs: form.techs.filter(el2 => el2 !== `${el.LAST_NAME} ${el.NAME} ${el.SECOND_NAME}`) }))}
                task={item}
                checked={form.techs.filter(el2 => el2 === `${el.LAST_NAME} ${el.NAME} ${el.SECOND_NAME}`).length}
                techs={form.techs}
                all={form.all}
                tasksToday={today.filter(el2 => el2[8] === item[8] && el2[3] === item[3])}
                setCoef={(c, name) => setCoef(prevState => {
                  const newArr = prevState.filter(names => names.name !== name)
                  return [...newArr, { name: name, coef: c }]
                })}
                datepicker={form.datepicker}
              />)}
          {form.techs.length && item[34] !== '0' ? <p style={{ marginTop: 10 }}>Задача выполнится в течении: <span style={{ fontWeight: 500 }}>{Math.ceil(item[34] / (8 * form.techs.length))} {declOfNum(Math.ceil(item[34] / (8 * form.techs.length)), ['дня', 'дней', 'дней'])}</span></p> : null}
        </div>
        <div>
          {form.typetime !== 'fixed' ? <label className={styles.label_check}>
            <input type="checkbox" checked={form.all} onChange={(e) => setForm(({ ...form, all: e.target.checked }))} />
            Выбрать все сегодняшние задачи данного вида
          </label> : null}
          {form.all ? <p>Выбранно <span style={{ fontWeight: 500 }}>{today.filter(el => el[8] === item[8] && el[3] === item[3]).length}</span> {declOfNum(today.filter(el => el[8] === item[8] && el[3] === item[3]).length, ['задача', 'задачи', 'задач'])} данного типа</p> : null}
        </div>
        <div className={styles.btn}>
          <button onClick={() => handleSubmit(form.datepicker, form.time, form.typetime, form.techs, form.all, item[0], coef)}>
            Назначить
          </button>
        </div>
      </div>

    </div>
  );
};

export default PopUp;
