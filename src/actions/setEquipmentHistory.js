export const setEquipmentHistory = async(id, type, value, user, func = () => {}) => {

    //console.log("id = ",id)
    //console.log("type =", type)
    // console.log(value)
    // console.log(user)

    let formData = new FormData();

    formData.append('id', id);
    formData.append('type', type);
    formData.append('value', value);
    formData.append('user', user);

    await fetch('https://volga24bot.com/kartoteka/api/equipment/pushToEquipmentHistory.php',{
        method: "POST",
        body: formData
    })
        .then(res => res.text())
        .then(res => {
            if (res) {
                console.log(res)
            }
        })
}