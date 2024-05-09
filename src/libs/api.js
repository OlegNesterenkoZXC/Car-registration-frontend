import { ethers } from "ethers"
import detectEthereumProvider from "@metamask/detect-provider";

import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/constants"

export async function getContractABI () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(CONTRACT_ABI)
    }, 1500);
  })
}

export async function getContractAddress() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(CONTRACT_ADDRESS)
    }, 1500);
  })
}

export function getProvider (url) {
  return new ethers.JsonRpcProvider(url)
}

export async function getMetaMaskProvider () {
  const provider = await detectEthereumProvider({ silent: true })

  if (!provider) {
    throw Error('MetaMask не найден')
  }

  return provider
}

export async function getDutiesSize(params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new ethers.Contract(address, abi, provider)

  return contract.getDutiesSize(vin)
}