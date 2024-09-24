import { GiUfo } from "react-icons/gi";
import { getAllReq, getMainReq, getNewReq } from "../state";
import { setLoading } from "../state/loading";
import { setShowTask } from "../state/showTask";

const isFreeTime = (tasks, newTask) => {
  const newTaskDate = new Date(newTask.date).getTime();
  const newNext = newTaskDate + 1 * 60 * 60 * 1000;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    let taskDate = new Date(task[56] + ' ' + task[57]).getTime();
    let next = taskDate + 1 * 60 * 60 * 1000;
    if (task[18] === 'Выполнена') {
      taskDate = new Date(task[5]).getTime();
      next = new Date(task[6]).getTime();
    }

    if (newTaskDate < next && newNext > taskDate) {
      return false;
    }
  }
  return true;
}

/**
* Возвращает массив всех заявок c 7 полями id, objectNumber, objectAddress...
* Заявки все кроме 'Не выезжали', ТО все новые для истории
*/
const fetchDataHistory = async () => {
  let a = null;
  let b = null;
  const url = `getTasks.php/?startDate=${a}&endDate=${b}`;
  const base = 'https://volga24bot.com/kartoteka/api/tech';
  
  try {
    const mass = await fetch(`${base}/${url}`).then(res => res.json());
    return mass;
  } catch (error) {
    console.log(error)
  }
}

const lowleveltech = ['Трусов Егор Владимирович'];

export const createTask = async (form, func, firstTime, secondTime, user, plane, graph) => {

  setLoading(true);

  if (lowleveltech.includes(form.customer) && form.type === 'СО') {
    alert('Этот техник не может выполнять снятие объемов.');
    setLoading(false);
    return;
  }

  if (form.type === '') {
    alert('Необходимо выбрать проблему заявки!!');
    setLoading(false);
    return;
  }

  if (form.date === '') {
    form.date = new Date().toLocaleDateString('en-CA') + 'T' + new Date().toLocaleTimeString();
  }

  if (form.customer) {
    if (form.customer !== 'Галкин Сергей Александрович') { //
      const maxTime = 8 * 3;
      const res = await fetch('https://volga24bot.com/kartoteka/api/crm/taskByTech.php?fio=' + form.customer.split(' ')[0])
        .then(res => res.json());
      var sumTime = 0;
      for (const item of res) sumTime += +item.timeJob;
      if (sumTime > maxTime) {
        alert(`На ${form.customer} назначено уже ${sumTime} часов работы, на него больше нельзя ставить задачи.`);
      }
    }
    // plane - новые и просроченные
    // graph - в работе и выполненные
    // 56 - дата
    // 57 - время
    // 34 - время работ

    const tasks = [...new Set([
      ...(plane.filter(el => el[42] === form.customer)),
      ...(plane.filter(el => el[55] === form.customer))
    ]), ...new Set([
      ...(graph.filter(el => el[42] === form.customer)),
      ...(graph.filter(el => el[55] === form.customer))
    ])];

    const is = isFreeTime(tasks, form);

    if (is === false) {
      alert('На это время у выбранного техника уже запланирована работа. Выберите другую дату и время!!');
      setLoading(false);
      return;
    }
  }

  // if (!form.customer) {
  //   if (form.objNum) {
  //     const base = 'https://volga24bot.com/kartoteka/api/tech';
  //     const url = `lastTech/lastTech.php/?objNum=${form.objNum}`;

  //     const response = await fetch(`${base}/${url}`).then(res => res.json());
  //     if (response.results !== false) {
  //       if (response.object !== null)
  //         form.customer = response.object.customer;
  //     }
  //   }
  // }

  if (form.type !== 'Монтаж' && form.type !== 'Подключение' && form.type !== 'Снятие объемов' && form.type !== 'Претензия' && form.type !== 'ТО') {
    const tasks = (await fetchDataHistory()).filter(el => (el[1] === form.objNum || el[2] === form.name) && el[4] !== '');
    const tasksNew = tasks.filter(el => el[18] === 'Новая').filter(el => el[8] !== 'ТО');
    console.log(tasksNew[0])
    if (tasksNew.length > 0) {
      const answer = window.confirm(`На этот объект уже существует ${tasksNew[0][8]}! Дата создания заявки ${tasksNew[0][17]} Открыть эту заявку? Там вы можете написать комментарий.`);
      if (answer) {
        func();
        setShowTask(tasksNew[0]);
      }
      setLoading(false);

      if (user.UF_DEPARTMENT[0] === 15 && answer === false) {
        alert("Создание Заявки в обход ограничениям (имеются привелегии инженерной службы)");
      } else {
        return;
      }
    }

  }



  let formData = new FormData();
  for (let key in form) {
    if (key !== 'files') {
      formData.append([key], form[key])
    } else {
      for (let i = 0; i < form.files.length; i++) {
        formData.append([form.files[i].name], form.files[i])
      }
    }
  }



  if (form.type === 'Нет контрольного события') {
    formData.append('type', 'Заявка')
    formData.append('type2', form.type)
    formData.append('comment', `${form.type} с ${form.comment}`)
  }


  if (form.label === "Претензия от пульта") {
    formData.append('type2', 'От пульта')
  }
  formData.append("creatorID", user.ID)
  formData.append("creatorName", `${user.LAST_NAME} ${user.NAME[0]}.${user.SECOND_NAME[0] ? user.SECOND_NAME[0] : ''}`)


  if (form.type === 'СО') {
    fetch('https://volga24bot.com/bot/createSoLead.php?application_token=2ac721c25667b3e8f30e782b9dca97fd', {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        formData.append('crm', res.result)
        fetch('https://volga24bot.com/kartoteka/api/tech/createMarkTask.php', {
          method: "POST",
          body: formData
        })
          .then(res => res.json())
          .then(res => {
            if (res === 'success') {
              alert('Задача создана');
              getNewReq({ 'a': `${firstTime.getFullYear()}-${firstTime.getMonth() < 9 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate()} 00:00:00`, 'b': `${secondTime.getFullYear()}-${secondTime.getMonth() < 9 ? '0' + (secondTime.getMonth() + 1) : secondTime.getMonth() + 1}-${secondTime.getDate()} 00:00:01` });

              func();
              setLoading(false)
            } else {
              alert('Задача не создана')
              setLoading(false)
            }
          })
          .catch(function (res) { console.log(res) })


      })
      .catch(function (res) { console.log(res) })
  } else {
    console.log(formData)

    fetch('https://volga24bot.com/kartoteka/api/tech/createMarkTask.php', {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res === 'success') {
          alert('Задача создана');
          getNewReq({ 'a': `${firstTime.getFullYear()}-${firstTime.getMonth() < 9 ? '0' + (firstTime.getMonth() + 1) : firstTime.getMonth() + 1}-${firstTime.getDate()} 00:00:00`, 'b': `${secondTime.getFullYear()}-${secondTime.getMonth() < 9 ? '0' + (secondTime.getMonth() + 1) : secondTime.getMonth() + 1}-${secondTime.getDate()} 00:00:01` });
          func();
          setLoading(false)
        } else {
          alert('Задача не создана')
          setLoading(false)
        }
      })
      .catch(function (res) { console.log(res) })
  }




}

