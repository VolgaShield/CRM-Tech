import { setLoading } from "../state/loading";
import { setEquipmentHistory } from "./setEquipmentHistory";

export const createEquipment = async (form, user) => {
  setLoading(true);

  if (form.name === '') {
    alert('Необходимо указать имя оборудования!!');
    setLoading(false);
    return;
  } else if (form.techName === '') {
    alert('Необходимо указать техника!!');
    setLoading(false);
    return;
  } else {
    let formData = new FormData();
    for (let key in form) { key==="status" ? formData.append("status", "Создан") : formData.append([key], form[key]) }
    formData.append('user',user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);

  // console.log("",
  // "create",
  // `Оборудование создано ${new Date().toLocaleDateString('en-CA') + ' ' + new Date().toLocaleTimeString()} Пользователем: ${user.LAST_NAME}`,
  // user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);

    //console.log(formData);
    fetch('https://volga24bot.com/kartoteka/api/equipment/createEquipment.php', {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res === 'success') {
          // setEquipmentHistory("", "create",JSON.stringify({"techName": form.techName}),user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);

          alert('Оборудование создано');
          setLoading(false)
        } else {
          alert(res)
          setLoading(false)
        }
      })
      .catch(function (res) { console.log(res) })
  }

  setLoading(false)
  return true;
}