import { setLoading } from "../state/loading";
import { setEquipmentHistory } from "./setEquipmentHistory";

export const deleteEquipment = async (id, user) => {
  setLoading(true);

  if (id === null) {
    alert('Ошибка: нет Id для удаления объекта (сообщите Фариду)!!');
    setLoading(false);
    return;
  } else {
    let formData = new FormData();
    formData.append('id', id)

    //console.log(formData)
    fetch('https://volga24bot.com/kartoteka/api/equipment/deleteEquipment.php', {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(res => {
        if (res === "success") {
            setEquipmentHistory(id, "delete", JSON.stringify({"deletedBy": user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME}), user.LAST_NAME + " " + user.NAME + " " + user.SECOND_NAME);
          alert('Удаление Успешно!');
          setLoading(false)
        } else {
          alert('Ошибка!')
          setLoading(false)
        }
      })
      .catch(function (res) { console.log(res) })
  }
  setLoading(false)
  return true;
}