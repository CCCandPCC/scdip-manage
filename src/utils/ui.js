import store from '@/store'

export const savePopup = (success) => {
  if (success)
  store.dispatch('doSnackbar', {text: "Changes saved successfully", colour: "success", icon: 'mdi-check-circle'})
  else
    store.dispatch('doSnackbar', {text: "Changes have not been saved", colour: "error", icon: 'mdi-alert-circle'})
}

export const deletePopup = (success) => {
  if (Number.isInteger(success))
    success = [200, 201, 204].includes(success)
    
  if (success)
  store.dispatch('doSnackbar', {text: "Item deleted successfully", colour: "success", icon: 'mdi-check-circle'})
  else
    store.dispatch('doSnackbar', {text: "Item couldn't be deleted", colour: "error", icon: 'mdi-alert-circle'})
}

export const abandonChanges = async (dialog) => {
  if (!store.getters.unsaved)
    return true

  const res = await dialog.display(
    "Unsaved changes",
    "<p>You have unsaved changes</p><p>Are you sure you want to leave?</p>",
    [{text:'Stay', color:'success'}, {text:'Leave', color:''}]) 

  console.log(res)
  if (res === 1) 
    store.commit('clearUnsaved')

  return res === 1
}