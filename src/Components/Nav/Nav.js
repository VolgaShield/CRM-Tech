import React, {useState, useEffect} from 'react';
import styles from './Nav.module.scss'
import {useStore} from "effector-react";
import {$nav, setNav} from "../../state/Nav";
import TypeNav from "./TypeNav";
import { Modal } from "./Modal/Modal";

import {$counters} from "../../state";

import {setCreateTask} from "../../state/createTaskState";

export const useLocalStorage = (key, initState) => {
  const [value, setValue] = useState(() => {
    const storage = localStorage.getItem(key);
    if (storage) return JSON.parse(storage);
    return initState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

const Nav = ({setRefresh}) => {
    const nav = useStore($nav);
    const count = useStore($counters);
    const [isOpen, setIsOpen] = useLocalStorage('modal', false);

    return (
        <div>

            <div className={styles.createTask}>
                <button onClick={() => {
                  setRefresh(prev => !prev);
                  setCreateTask(true);
                  }}>+</button>
            </div>
              <div className={styles.card}>
              <button onClick={() => setIsOpen(true)}>
                Подтвердить карточки
              </button>
              {isOpen && <Modal setIsOpen={setIsOpen} />}
            </div>
            <div className={styles.navWrapper}>
                    <ul>
                        {/*<p style={{textAlign: "center", fontWeight: 500}}>Всего: {count.req+count.mon+count.dem+count.so+count.to+count.pre} - <span style={{color:"red"}}>{notComp.req+notComp.mon+notComp.dem+notComp.so+notComp.to+notComp.pre}</span></p>*/}
                        <li style={{background: "white", border: "none"}}>{count.NEW.so + count.NEW.mon + count.NEW.dem + count.NEW.corp} - <span style={{color:"green"}}>{count.COMP.so + count.COMP.mon + count.COMP.dem + count.COMP.corp}</span> - <span style={{color:"red"}}>{count.NC.so + count.NC.mon + count.NC.dem + count.NC.corp}</span></li>
                        <li className={nav === 'so' ? styles.active : null} onClick={() => {
                            setNav('so')
                        }}><p>{count.NEW.so} - <span style={{color:"green"}}>{count.COMP.so}</span> - <span style={{color:"red"}}>{count.NC.so}</span></p><p>(СО) </p></li>
                        <li className={nav === 'mon' ? styles.active : null} onClick={() => {
                            setNav('mon')
                        }}><p>{count.NEW.mon} - <span style={{color:"green"}}>{count.COMP.mon}</span> - <span style={{color:"red"}}>{count.NC.mon}</span></p><p>(М)онтажи </p></li>
                        <li className={nav === 'dem' ? styles.active : null} onClick={() => {
                            setNav('dem')
                        }}><p>{count.NEW.dem} - <span style={{color:"green"}}>{count.COMP.dem}</span> - <span style={{color:"red"}}>{count.NC.dem}</span></p><p>(Д)емонтажи  </p></li>
                        <li className={nav === 'corp' ? styles.active : null} onClick={() => {
                                    setNav('corp')
                                }}><p>{count.NEW.corp} - <span style={{color:"green"}}>{count.COMP.corp}</span> - <span style={{color:"red"}}>{count.NC.corp}</span></p><p>Сетевые</p></li>
                                {/* <li className={nav === 'sp' ? styles.active : null} onClick={() => {
                                    setNav('sp')
                                }}><p>{count.NEW.sp} - <span style={{color:"green"}}>{count.COMP.sp}</span> - <span style={{color:"red"}}>{count.NC.sp}</span></p><p>Снятие/Постановка</p></li>
                                <li className={nav === 'key' ? styles.active : null} onClick={() => {
                                    setNav('key')
                                }}><p>{count.NEW.key} - <span style={{color:"green"}}>{count.COMP.key}</span> - <span style={{color:"red"}}>{count.NC.key}</span></p><p>Ключ</p></li> */}


                    </ul>

                <ul>
                    {/*<p style={{textAlign: "center", fontWeight: 500}}>Всего: {count.req+count.mon+count.dem+count.so+count.to+count.pre} - <span style={{color:"red"}}>{notComp.req+notComp.mon+notComp.dem+notComp.so+notComp.to+notComp.pre}</span></p>*/}
                    <li style={{background: "white", border: "none"}}>{count.NEW.connection + count.NEW.repeats + count.NEW.deffect + count.NEW.preP} - <span style={{color:"green"}}>{count.COMP.connection + count.COMP.repeats + count.COMP.deffect + count.COMP.preP}</span> - <span style={{color:"red"}}>{count.NC.connection + count.NC.repeats + count.NC.deffect + count.NC.preP}</span></li>
                    <li className={nav === 'connection' ? styles.active : null} onClick={() => {
                        setNav('connection')
                    }}><p>{count.NEW.connection} - <span style={{color:"green"}}>{count.COMP.connection}</span> - <span style={{color:"red"}}>{count.NC.connection}</span></p><p>Нет (КС)</p></li>
                    <li className={nav === 'repeats' ? styles.active : null} onClick={() => {
                        setNav('repeats')
                    }}><p>{count.NEW.repeats} - <span style={{color:"green"}}>{count.COMP.repeats}</span> - <span style={{color:"red"}}>{count.NC.repeats}</span></p><p>(П)овторы </p></li>
                    <li className={nav === 'deffect' ? styles.active : null} onClick={() => {
                        setNav('deffect')
                    }}><p>{count.NEW.deffect} - <span style={{color:"green"}}>{count.COMP.deffect}</span> - <span style={{color:"red"}}>{count.NC.deffect}</span></p><p>Брак </p></li>
                    <li className={nav === 'preP' ? styles.active : null} onClick={() => {
                        setNav('preP')
                    }}><p>{count.NEW.preP} - <span style={{color:"green"}}>{count.COMP.preP}</span> - <span style={{color:"red"}}>{count.NC.preP}</span></p><p>(ПР) от Пульта</p></li>
                    {/* <li className={nav === 'sh' ? styles.active : null} onClick={() => {
                        setNav('sh')
                    }}><p>{count.NEW.sh} - <span style={{color:"green"}}>{count.COMP.sh}</span> - <span style={{color:"red"}}>{count.NC.sh}</span></p><p>Шлейф</p></li>
                    <li className={nav === 'ddv' ? styles.active : null} onClick={() => {
                        setNav('ddv')
                    }}><p>{count.NEW.ddv} - <span style={{color:"green"}}>{count.COMP.ddv}</span> - <span style={{color:"red"}}>{count.NC.ddv}</span></p><p>220B</p></li> */}
                </ul>
                    <ul>
                        <li style={{background: "white", border: "none"}}>{count.NEW.req + count.NEW.pre + count.NEW.toM + count.NEW.toQ + count.NEW.sp + count.NEW.key + count.NEW.sh + count.NEW.kts + count.NEW.ddv} - <span style={{color:"green"}}>{count.COMP.req + count.COMP.pre + count.COMP.toM + count.COMP.toQ + count.COMP.sp + count.COMP.key + count.COMP.sh + count.COMP.kts + count.COMP.ddv}</span> - <span style={{color:"red"}}>{count.NC.req + count.NC.pre + count.NC.toM + count.NC.toQ + count.NC.sp + count.NC.key + count.NC.sh + count.NC.kts + count.NC.ddv}</span></li>
                        <li className={nav === 'req' ? styles.active : null} onClick={() => {
                            setNav('req')

                        }}><p>{count.NEW.req} - <span style={{color:"green"}}>{count.COMP.req}</span> - <span style={{color:"red"}}>{count.NC.req}</span></p><p>(З)аявки </p></li>
                        <li className={nav === 'pre' ? styles.active : null} onClick={() => {
                            setNav('pre')

                        }}><p>{count.NEW.pre} - <span style={{color:"green"}}>{count.COMP.pre}</span> - <span style={{color:"red"}}>{count.NC.pre}</span></p><p>(ПР)етензии </p></li>
                        <li className={nav === 'toM' ? styles.active : null} onClick={() => {
                            setNav('toM')

                        }}><p>{count.NEW.toM} - <span style={{color:"green"}}>{count.COMP.toM}</span> - <span style={{color:"red"}}>{count.NC.toM}</span></p><p>ТО (М)</p></li>
                        <li className={nav === 'toQ' ? styles.active : null} onClick={() => {
                            setNav('toQ')

                        }}><p>{count.NEW.toQ} - <span style={{color:"green"}}>{count.COMP.toQ}</span> - <span style={{color:"red"}}>{count.NC.toQ}</span></p><p>ТО (К)</p></li>
                        {/* <li className={nav === 'kts' ? styles.active : null} onClick={() => {
                            setNav('kts')

                        }}><p>{count.NEW.kts} - <span style={{color:"green"}}>{count.COMP.kts}</span> -<span style={{color:"red"}}>{count.NC.kts}</span></p><p>КТС</p></li> */}
                    </ul>
                </div>
                <div className={styles.bbb}>
                  {nav === 'req' || nav === 'sp' || nav === 'sh' || nav === 'kts' || nav === 'key' || nav === 'ddv'
                  ? <ul>
                    <li className={nav === 'sp' ? styles.redActive : styles.red} onClick={() => {
                        setNav('sp')
                    }}><p>{count.NEW.sp} - <span style={{color:"green"}}>{count.COMP.sp}</span> - <span style={{color:"red"}}>{count.NC.sp}</span></p><p>С/П</p></li>
                    <li className={nav === 'sh' ? styles.redActive : styles.red} onClick={() => {
                        setNav('sh')
                    }}><p>{count.NEW.sh} - <span style={{color:"green"}}>{count.COMP.sh}</span> - <span style={{color:"red"}}>{count.NC.sh}</span></p><p>Шлейф</p></li>
                    <li className={nav === 'kts' ? styles.redActive : styles.red} onClick={() => {
                        setNav('kts')
                    }}><p>{count.NEW.kts} - <span style={{color:"green"}}>{count.COMP.kts}</span> - <span style={{color:"red"}}>{count.NC.kts}</span></p><p>КТС</p></li>
                    <li className={nav === 'key' ? styles.yellowActive : styles.yellow} onClick={() => {
                        setNav('key')
                    }}><p>{count.NEW.key} - <span style={{color:"green"}}>{count.COMP.key}</span> - <span style={{color:"red"}}>{count.NC.key}</span></p><p>Ключ</p></li>
                    <li className={nav === 'ddv' ? styles.yellowActive : styles.yellow} onClick={() => {
                        setNav('ddv')
                    }}><p>{count.NEW.ddv} - <span style={{color:"green"}}>{count.COMP.ddv}</span> - <span style={{color:"red"}}>{count.NC.ddv}</span></p><p>220B</p></li>
                    </ul>
                  : null }
                </div>

            <TypeNav/></div>

    );
}



export default Nav;
