import { Contract } from "ethers"
import axios from "axios";
import detectEthereumProvider from "@metamask/detect-provider";

import { CONTRACT_INFO_URL } from "@/constants"

export async function getContractInfo () {
  const response = await axios.request({
    method: "GET",
    url: CONTRACT_INFO_URL
  })

  return response.data
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

  const contract = new Contract(address, abi, provider)

  return contract.getDutiesSize(vin)
}

export async function isExistCar(params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new Contract(address, abi, provider)

  return contract.isExistCar(vin)
}

export async function getCarDuties(params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new Contract(address, abi, provider)

  return contract.getCarDuties(vin)
}


export async function getAmountDuty (params) {
  const {
    address,
    abi,
    provider,
    duty,
  } = params

  const contract = new Contract(address, abi, provider)

  return contract.dutiesAmount(duty)
}

export async function getTotalAmountDuties(params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new Contract(address, abi, provider)

  return contract.getAmountDuties(vin)
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
  
  const contract = new Contract(address, abi, provider)
  
  const tx = await contract.connect(signer).payCarDuties(vin, { value: amount })
  
  return tx.wait()
}

export async function getInsurancePolicies (params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new Contract(address, abi, provider)

  return contract.getInsurancePolicies(vin)
}

export async function getVehiclePassports (params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new Contract(address, abi, provider)

  return contract.getVehiclePassports(vin)
}

export async function getRegistrationDates (params) {
  const {
    address,
    abi,
    provider,
    vin
  } = params

  const contract = new Contract(address, abi, provider)

  return contract.getRegistrationDates(vin)
}

export async function getVinInfo (vin) {
  const { data } = await axios.request({
    method: 'GET',
    url: `https://auto.dev/api/vin/${vin}`,
    params: {
      apikey: 'ZrQEPSkKb2xlZ2lrbmVzdGVyQGdtYWlsLmNvbQ=='
    }
  })

  return data
}