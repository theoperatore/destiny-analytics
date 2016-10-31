import React from 'react';

export default function Schedule(props) {
  const style = {
    backgroundImage: `url(https://bungie.net${props.background})`,
    backgroundRepeat: 'no-repeat',
  }
  return <div
    className='schedule'
    onClick={props.onClick}
    style={style}
  >
    <img
      src={`https://bungie.net${props.emblem}`}
      width='75'
      height='75'
      alt='destiny-class-emblem'
    />
    <div className='schedule-meta'>
      <p>{props.name}</p>
      <p>{props.dclass}</p>
    </div>
  </div>
}