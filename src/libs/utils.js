import { JsonRpcProvider, BrowserProvider, toUtf8Bytes, keccak256, formatEther as formatEtherLIB } from "ethers";

import { BLOCKCHAIN_URL } from "@/constants";

export function formatDate (date) {
  const days = date.getDate()
  let daysString = ''
  if(days < 10) {
    daysString = `0${days}`
  } else {
    daysString = `${days}`
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

export function formatEther (value) {
  return formatEtherLIB(value)
}

export function encodeRole (s) {
  return keccak256(toUtf8Bytes(s))
}

export function getProvider () {
  return new JsonRpcProvider(BLOCKCHAIN_URL)
}

export function getBrowserProvider (provider) {
  return new BrowserProvider(provider)
}