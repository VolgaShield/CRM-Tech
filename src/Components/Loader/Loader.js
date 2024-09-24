import React, {useEffect, useRef, useState} from 'react';
import './Loader.css'


const Loader = () => {

    return (
        <div className="loader-main-wrapper">
            <div className="loader-flexbox">
                <div className="loader-wrapper">
                    <div className="loader">Loading...</div>
                </div>
            </div>
        </div>



    );
}



export default Loader;
