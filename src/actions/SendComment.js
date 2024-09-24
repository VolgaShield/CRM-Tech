
import {getComment} from "../state/comments";
import {setLoading} from "../state/loading";

export const sendComment = (senderID, senderName, comment, task, type, inviz) => {
    setLoading(true)
    let formData = new FormData();

    formData.append("senderID", senderID);
    formData.append("senderName", senderName);
    formData.append("comment", comment);
    formData.append("task", task[0]);
    formData.append("type", type);
    formData.append("inviz", inviz ? 1 : 0);
    fetch('https://volga24bot.com/kartoteka/api/tech/comment.php',{
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            if (res) {
               getComment(task[0])

                setLoading(false)
               fetch(`https://volga24bot.com/bot/notification.php?type=comment&application_token=2ac721c25667b3e8f30e782b9dca97fd&userName=${task[42]}&message=Вам пришло сообщение от ${senderName} по задаче ${task[47]}`);
            }

        })
        .catch(function(res){ console.log(res) })

}