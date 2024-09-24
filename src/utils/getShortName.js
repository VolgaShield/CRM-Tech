export const getShortName = (name) => {
    
    const short_name = name.split(" ")[0]+" "+name.split(" ")[1][0]+"."+name.split(" ")[2][0]+".";

    return short_name
}