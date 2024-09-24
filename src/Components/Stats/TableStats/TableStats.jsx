
const TableStats = ({ sd, ed, stats }) => {
  const techs = Array.from(new Set(stats?.kpds?.map(el => el.tech)));
  const days = Array.from(new Set(stats?.kpds?.map(el => el.createAt)));

  const colorKpd = (kpd) => {
    if (+kpd >= 70) return { 'backgroundColor': 'lightgreen' };
    if (+kpd <= 30) return { 'backgroundColor': 'lightsalmon' };
    return { 'backgroundColor': 'white' };
  }
  const stylesExcelKpd = (kpd) => {
    if (+kpd >= 70) return "90EE90";
    if (+kpd <= 30) return "ffa07a";
    return;
  }

  const filtredArray = (tech, arr) => {
    return arr.filter(item => item.tech === tech)
      .filter(item => (new Date(item.createAt).getDay() !== 6
        && new Date(item.createAt).getDay() !== 0) || item.kpd !== '0');
  }

  const columns = ['сред', 'макс', 'прет', 'повт', 'невы', 'прог', 'брак'];
  const Average = (tech, arr) => {
    const filtredArr = filtredArray(tech, arr);
    return (filtredArr.reduce((a, b) => a + +b.kpd, 0) / filtredArr.length).toFixed(1);
  }
  const Absense = (tech, arr) => {
    const filtredArr = filtredArray(tech, arr);
    return filtredArr.filter(item => item.kpd === '0').length;
  }

  return (
    <table border="1" cellPadding="3" >
      <tbody>
        {columns.map(column =>
          <tr key={column} >
            <th data-t="s" data-a-h="center" data-f-sz="8" key={column}>{column}</th>
            {techs.map(tech => {
              if (column === 'сред') {
                const avrg = Average(tech, stats?.kpds);
                return <th style={colorKpd(avrg)} data-t="n" data-fill-color={stylesExcelKpd(avrg)} data-a-h="center" data-f-sz="10">{avrg}</th>;
              }
              else if (column === 'макс') {
                const max = Math.max(...filtredArray(tech, stats?.kpds).map(item => +item.kpd));
                return <th style={colorKpd(max)} data-t="n" data-fill-color={stylesExcelKpd(max)} data-a-h="center" data-f-sz="10">{max}</th>;
              }
              else if (column === 'прет')
                return <th data-t="n" data-a-h="center" data-f-sz="10">{stats?.pretensions.filter(p => p.plane_techs.includes(tech)).length}</th>;
              else if (column === 'повт')
                return <th data-t="n" data-a-h="center" data-f-sz="10">{stats?.repeats.filter(p => p.plane_techs.includes(tech)).length}</th>;
              else if (column === 'невы')
                return <th data-t="n" data-a-h="center" data-f-sz="10">{stats?.notCompleted.filter(p => p.plane_techs.includes(tech)).length}</th>;
              else if (column === 'прог')
                return <th data-t="n" data-a-h="center" data-f-sz="10">{Absense(tech, stats?.kpds)}</th>;
              else if (column === 'брак')
                return <th data-t="n" data-a-h="center" data-f-sz="10">{stats?.defect.filter(p => p.plane_techs.includes(tech)).length}</th>;
              return 'Это ошибочное сообщение, ты не мог сюда попасть';
            })}
          </tr>)}
      </tbody>
    </table>
  )
}

export default TableStats;