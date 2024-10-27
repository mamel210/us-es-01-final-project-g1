import React from 'react'
import "../../styles/cardIndicator.css"
import { CiViewList } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { GoGoal } from "react-icons/go";
import { MdOutlineDisabledByDefault } from "react-icons/md";

const iconMap = {
    planCount: CiViewList,
    membersCount: FaUsers,
    timeCount: CiClock2,
    percentageGoal: GoGoal,
    default: MdOutlineDisabledByDefault
  };
   
  export const CardIndicator = ({value, description, section="default"}) => {
    const Icon = iconMap[section] || iconMap["default"]
  return (
    <div className="cardIndicator-content">
    <div className="cardIndicator-value">{value}</div>
    <div className="cardIndicator-description">{description}</div>
    <Icon className='cardIndicator-icon'/>
  </div>
  )
}
