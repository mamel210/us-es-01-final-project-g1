import React, { useContext } from 'react'
import { Context } from '../store/appContext'

export const useItems = () => {

  const { actions } = useContext(Context)
  const detailsPlanLevelDetails = {
    item_1: { onClick: () => actions.setTrainingPlansFilters("begginer") },
    item_2: { onClick: () => actions.setTrainingPlansFilters("intermediate") },
    item_3: { onClick: () => actions.setTrainingPlansFilters("advanced") },
  }

  return { detailsPlanLevelDetails }
}