export function formatDate (date) {
  const days = date.getDate()
  let daysString = ''
  if(days < 10) {
    daysString = `0${days + 1}`
  } else {
    daysString = `${days + 1}`
  }

  const months = date.getMonth()
  let monthsString = ''
  if(months < 10) {
    monthsString = `0${months + 1}`
  } else {
    monthsString = `${months + 1}`
  }

  return `${daysString}.${monthsString}.${date.getFullYear()}`
}