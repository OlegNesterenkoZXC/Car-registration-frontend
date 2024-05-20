import { ethers } from "ethers"
import axios from "axios";
import detectEthereumProvider from "@metamask/detect-provider";

import { BLOCKCHAIN_URL, CONTRACT_INFO_URL } from "@/constants"

export async function getContractInfo () {
  const response = await axios.request({
    method: "GET",
    url: CONTRACT_INFO_URL
  })

  return response.data
}

export function getProvider () {
  return new ethers.JsonRpcProvider(BLOCKCHAIN_URL)
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

export async function isExistCar(params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  try {
    const contract = new ethers.Contract(address, abi, provider)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(contract.isExistCar(vin))
      }, 1500)
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getCarDuties(params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  try {
    const contract = new ethers.Contract(address, abi, provider)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(contract.getCarDuties(vin))
      }, 1500)
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getAmountDuty (params) {
  const {
    address,
    abi,
    provider,
    duty,
  } = params

  const contract = new ethers.Contract(address, abi, provider)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(contract.dutiesAmount(duty))
    }, 1500)
  })
}

export async function getTotalAmountDuties(params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new ethers.Contract(address, abi, provider)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(contract.getAmountDuties(vin))
    }, 1500)
  })
}

export async function payCarDuties (params) {
  const {
    address,
    signer,
    abi,
    provider,
    vin,
    amount
  } = params

  try {
    const contract = new ethers.Contract(address, abi, provider)

    const tx = await contract.connect(signer).payCarDuties(vin, { value: amount })

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(tx.wait())
      }, 1500)
    })
  } catch (error) {
    console.error(error);
  }
}

export async function getInsurancePolicies (params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  try {
    const contract = new ethers.Contract(address, abi, provider)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(contract.getInsurancePolicies(vin))
      }, 1500)
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getVehiclePassports (params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new ethers.Contract(address, abi, provider)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(contract.getVehiclePassports(vin))
    }, 1500)
  })
}

export async function getRegistrationDates (params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new ethers.Contract(address, abi, provider)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(contract.getRegistrationDates(vin))
    }, 1500)
  })
}

export async function getVinInfo (vin) {
  const response = await axios.request({
    method: 'GET',
    url: `https://auto.dev/api/vin/${vin}`,
    params: {
      apikey: 'ZrQEPSkKb2xlZ2lrbmVzdGVyQGdtYWlsLmNvbQ=='
    }
  })

  return response.data
}