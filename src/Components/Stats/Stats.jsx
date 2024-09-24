import { useState, useRef } from "react";
import TableToExcel from "@linways/table-to-excel";
import styles from './Stats.module.scss';
import PageButton from "./PageButton/PageButton";
import TableKpd from "./TableKpd/TableKpd";
import TableStats from "./TableStats/TableStats";

const pages = {
  page: '/',
  kpds: 'Статистика техников'
}

const Stats = () => {
  const [page, setPage] = useState(pages.start);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const refTable = useRef();
  const [stats, setStats] = useState();

  const StatsHandler = () => {
    fetch(`https://volga24bot.com/kartoteka/api/tech/Stats/getStats.php?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(e => console.error(e))
  }

  const UploadTables = () => {
    if (!stats) {
      alert('Для начал нужно выбрать период и сгенерировать таблицу.');
      return;
    }
    TableToExcel.convert(refTable.current);
  }

  return (
    <div>
      <PageButton onClick={() => setPage(pages.kpds)}>{pages.kpds}</PageButton>

      {page === pages.kpds
        ? <>
          <div className={styles.chooseDate}>
            <input type="date" valueAsDate={startDate} onChange={e => setStartDate(new Date(e.target.value))} />
            <input type="date" valueAsDate={endDate} onChange={e => setEndDate(new Date(e.target.value))} />
            <button onClick={StatsHandler}>Сгенерировать</button>
            <button onClick={UploadTables}>Выгрузить</button>
          </div>
          <table ref={refTable} data-cols-width="5">
            <td>
              <tr>
                <th></th>
                <th data-t="s" data-f-sz="12" data-f-bold="true">
                  Ведомость за {startDate.toLocaleString('ru', { month: 'long' })} {startDate.getFullYear()}</th>
              </tr>
            </td>
            <td><TableKpd sd={startDate} ed={endDate} kpds={stats?.kpds} /></td>
            <td><tr></tr></td>
            <td><TableStats sd={startDate} ed={endDate} stats={stats} /></td>
          </table>
        </> : null}
    </div>
  )
}

export { Stats };