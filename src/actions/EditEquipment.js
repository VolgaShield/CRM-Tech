import { setLoading } from "../state/loading";
import { setEquipmentHistory } from "./setEquipmentHistory";

export const editEquipment = async (method, form, user) => {

  //Ловим разные ошибки
  if (method === null && form === null && user === null) { alert('Ошибка! (null form)'); }
  else if (!form.hasOwnProperty('id') && !user.hasOwnProperty('LAST_NAME') && !user.hasOwnProperty('NAME') && !user.hasOwnProperty('SECOND_NAME')) { alert('Ошибка! (Invalid arguments)'); return; }
  else if (method === "editStatus" && !form.hasOwnProperty('status') && !form.hasOwnProperty('techName')) { alert('Ошибка! (method bad arguments)'); return; }

  setLoading(true);

  let formData = new FormData(); //this bad boi can hold so much data in it
  Object.entries(form).forEach(([key, val]) => {
    formData.append(key, val)
  });

  let valuesJSON = {};  //Объект (массив) переменных, которые записываются в историю в качестве JSON-подобной-строки
  Object.entries(form).forEach(([key, val]) => {
    if (key !== "id") {
      valuesJSON[key] = val;
    }
  });

  //Логи для дебага
  // console.log(valuesJSON);
  // for (var pair of formData.entries()) {
  //   console.log(pair[0] + ', ' + pair[1]);
  // }

  fetch('https://volga24bot.com/kartoteka/api/equipment/editEquipment.php', { method: "POST", body: formData })
    .then(res => res.text()).then(res => {
      if (res === "success") {
        if (method === "editStatus") { setEquipmentHistory(form.id, "editStatus", JSON.stringify(valuesJSON), user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME); }
        //Сюда может идти какой-нибудь другой метод через else if 
        else { alert('Ошибка! (Method returned error)'); setLoading(false); } //Возвращаем ошибку если метод не подошел
        
        alert('Изменено Успешно!'); setLoading(false);
      } else {
        alert('Ошибка! (PHP file returned error)'); setLoading(false);
      }
    }).catch(function (res) { console.log(res) })

  setLoading(false)
  return true;
}