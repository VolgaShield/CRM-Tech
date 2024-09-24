import React, { useEffect, useState } from "react";
import { useStore } from "effector-react";

import './App.css';

import TechControl from "./Components/TechControl/TechControl";
// import TaskItemWrapper from "./Components/TaskItemWrapper/TaskItemWrapper";
// import { $task } from "./state/task";
import JobCalendar from "./Components/JobCalendar/JobCalendar";
import Search from "./Components/Search/Search";
import MapContainer from "./Components/Map/Maps";
import { Stats } from './Components/Stats/Stats';
import { Equipment } from './Components/Equipment/Equipment';
import TaskItemWrapper from "./Components/TaskItemWrapper/TaskItemWrapper";
import Loader from "./Components/Loader/Loader";
import Raport from "./Components/Raport/Raport";
import CreateTask from "./Components/CreateTask/CreateTask";
import TaskItemNew from "./Components/TaskItemNew/TaskItemNew";
import BurgerMenu from "./Components/BurgerMenu/BurgerMenu";
import Plane from "./Components/Plane/Plane";

import { $allReqStatus, getAllReq, getMainReq } from "./state";
import { $task } from "./state/task";
import { $mapNav } from "./state/mapNav";
import { $depStatus, $user, getDep, setUser } from "./state/user";
import { $search, getReq, setSearch } from "./state/Search";
import { $loading } from "./state/loading";
import { $createTask, setCreateTask } from "./state/createTaskState";
import { $showTask } from "./state/showTask";
import { $nav } from "./state/main_nav";
import { getUsers } from "./state/getUsers";
import { setItems } from './store/objectWithAndromeda';

import SearchImg from './img/search.png';
import Burger from './img/menu.png';

const fetchItems = () => {
    fetch(`https://volga24bot.com/kartoteka/api/tech/getAll.php`)
        .then(response => response.json())
        .then(commits => setItems(commits.map(commit => {
            commit.ObjectNumber = Number(commit.ObjectNumber).toString(16)
            return commit;
        })));
}

function App() {
    const [active, setActive] = useState(false);
    const task = useStore($showTask);
    const notComp = useStore($allReqStatus);
    const mapNav = useStore($mapNav);
    const user = useStore($user);
    const search = useStore($search);
    const loading = useStore($loading);
    const create = useStore($createTask);
    const nav = useStore($nav);
    const dep = useStore($depStatus);

    useEffect(() => {
        if (window.bx24) {
            const bx24 = window.bx24;
            bx24.init(bx24.callMethod('user.current', {}, function (res) { setUser(res.data()) }));
        } else {
            //setUser({ID: "155", NAME: 'Тимур', LAST_NAME: 'Лиджанов', SECOND_NAME : 'Николаевич', UF_DEPARTMENT: [51]})
            // setUser({ID: "3717", NAME: 'Егор', LAST_NAME: 'Трусов', SECOND_NAME : 'Владимирович', UF_DEPARTMENT: [5]})
            //setUser({ID: "1", NAME: 'Фёдор', LAST_NAME: 'Клочков', SECOND_NAME : 'Викторович', UF_DEPARTMENT: [5]})
            //setUser({ ID: "1", NAME: 'Фарид', LAST_NAME: 'Иралиев', SECOND_NAME: 'Апахович', UF_DEPARTMENT: [15] })
            //setUser({ID: "3745", NAME: 'Фарид', LAST_NAME: 'Наурзгалиев', SECOND_NAME : 'Робертович', UF_DEPARTMENT: [15]})
			//setUser({ID: "3769", NAME: 'Александр', LAST_NAME: 'Косарев', SECOND_NAME : 'Сергеевич', UF_DEPARTMENT: [15]})
			//setUser({ID: "91", NAME: 'Евгений', LAST_NAME: 'Орлов', SECOND_NAME : 'Сергеевич', UF_DEPARTMENT: [15]})
			//setUser({ID: "81", NAME: 'Сергей', LAST_NAME: 'Пономарев', SECOND_NAME : 'Владимирович', UF_DEPARTMENT: [15]})
			//setUser({ID: "3717", NAME: 'Егор', LAST_NAME: 'Трусов', SECOND_NAME : 'Владимирович', UF_DEPARTMENT: [15]})
            setUser({ID: "3789", NAME: 'Денис', LAST_NAME: 'Закаблуков', SECOND_NAME : 'Владимирович', UF_DEPARTMENT: [15]})
        }

        getAllReq();
        getReq();
        getUsers();

        if (!dep.length) {
            getUsers()
        };

        fetchItems();
    }, []);

    useEffect(() => { getDep(user.UF_DEPARTMENT) }, [user]);

    return (
        <div className="App">
            {
                task ?
                    <TaskItemNew item={task} /> :
                    search
                        ? <Search />
                        : <>
                            <BurgerMenu active={active} setActive={setActive} />
                            <div className="main_nav_wrapper">
                                {nav !== 'plane' ? <img src={SearchImg} alt="" className='search' onClick={() => setSearch(true)} /> : <div> </div>}
                                <img alt="" onClick={() => setActive(prevState => !prevState)} src={Burger} />
                            </div>
                            {create ? <CreateTask func={() => setCreateTask(false)} /> : null}
                            <div style={create ? { display: 'none' } : null}>
                                {nav === 'map' ? <MapContainer items={notComp} nav={mapNav} user={user} /> : null}
                                {nav === 'control' ? <TechControl /> : null}
                                {nav === 'graph' ? <JobCalendar /> : null}
                                {nav === 'raport' ? <Raport /> : null}
                                {nav === 'plane' ? <Plane /> : null}
                                {nav === 'stats' ? <Stats /> : null}
                                {nav === 'equipment' ? <Equipment /> : null}
                            </div>
                        </>
            }
            {loading ? <Loader /> : null}
        </div>
    );
};

export default App;
