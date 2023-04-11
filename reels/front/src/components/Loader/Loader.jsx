import React from 'react'
import style from './Loader.css'

const Loader = () => {
  return (
    <div className={style["loaderContainer"]}>
        <div className={style["spinner"]}>
            <div className={style["dot1"]}/>
            <div className={style["dot2"]} />
        </div>
    </div>
  )
}

export default Loader