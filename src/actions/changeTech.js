
export const changeTech = async (ids, tech) => {
    const url = `changeTech.php/?ids=${ids}&tech=${tech}`
    const base = 'https://volga24bot.com/kartoteka/api/tech';


    const req = await fetch(`${base}/${url}`)

    return req.json()
}