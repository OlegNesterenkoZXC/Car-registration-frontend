export const VIN_REGEXP = /[A-HJ-NPR-Z0-9]{17}/i

export const DUTIES_DESCRIPTION = {
  AUTO_LICENSE_PLATES: 'Выдача номерных знаков на автомобиль',
  MOTORCYCLE_LICENSE_PLATES: 'Выдача номерных знаков на мотоцикл',
  VEHICLE_REGISTRATION_CERTIFICATE: 'СТС',
  CHANGE_PASSPORT_VEHICLE: 'Внесение изменений в ПТС',
  ISSUANCE_VEHICLE_PASSPORT: 'Выдача нового ПТС',
}

export const BLOCKCHAIN_URL = 'http://127.0.0.1:8545'

export const CONTRACT_ADDRESS = '0x5095d3313C76E8d29163e40a0223A5816a8037D8'

export const CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AccessControlBadConfirmation",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "neededRole",
          "type": "bytes32"
        }
      ],
      "name": "AccessControlUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "EDITOR_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_duty",
          "type": "string"
        }
      ],
      "name": "addCarDuty",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "series",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "number",
              "type": "string"
            }
          ],
          "internalType": "struct CarRegistrationSystem.InsurancePolicy",
          "name": "_insurancePolicy",
          "type": "tuple"
        }
      ],
      "name": "addInsurancePolicy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "start",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "end",
              "type": "uint256"
            }
          ],
          "internalType": "struct CarRegistrationSystem.RegistrationDate",
          "name": "_registrationDate",
          "type": "tuple"
        }
      ],
      "name": "addRegistrationDate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "region",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "series",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "number",
              "type": "string"
            }
          ],
          "internalType": "struct CarRegistrationSystem.VehiclePassport",
          "name": "_vehiclePassport",
          "type": "tuple"
        }
      ],
      "name": "addVehiclePassport",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "dutiesList",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "editDuty",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "series",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "number",
              "type": "string"
            }
          ],
          "internalType": "struct CarRegistrationSystem.InsurancePolicy",
          "name": "_insurancePolicy",
          "type": "tuple"
        }
      ],
      "name": "editInsurancePolicy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "start",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "end",
              "type": "uint256"
            }
          ],
          "internalType": "struct CarRegistrationSystem.RegistrationDate",
          "name": "_registrationDate",
          "type": "tuple"
        }
      ],
      "name": "editRegistrationDate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "region",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "series",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "number",
              "type": "string"
            }
          ],
          "internalType": "struct CarRegistrationSystem.VehiclePassport",
          "name": "_vehiclePassport",
          "type": "tuple"
        }
      ],
      "name": "editVehiclePassport",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "getAmountDuties",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "getCarDuties",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "getCarDutiesSize",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "getInsurancePolicies",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "series",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "number",
              "type": "string"
            }
          ],
          "internalType": "struct CarRegistrationSystem.InsurancePolicy[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "getInsurancePoliciesSize",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "getInsurancePolicy",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "series",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "number",
              "type": "string"
            }
          ],
          "internalType": "struct CarRegistrationSystem.InsurancePolicy",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "getRegistrationDate",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "start",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "end",
              "type": "uint256"
            }
          ],
          "internalType": "struct CarRegistrationSystem.RegistrationDate",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "getRegistrationDates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "start",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "end",
              "type": "uint256"
            }
          ],
          "internalType": "struct CarRegistrationSystem.RegistrationDate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "getRegistrationDatesSize",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getRoleMember",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleMemberCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "getVehiclePassport",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "region",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "series",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "number",
              "type": "string"
            }
          ],
          "internalType": "struct CarRegistrationSystem.VehiclePassport",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "getVehiclePassports",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "region",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "series",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "number",
              "type": "string"
            }
          ],
          "internalType": "struct CarRegistrationSystem.VehiclePassport[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "getVehiclePassportsSize",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "isExistCar",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        }
      ],
      "name": "payCarDuties",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "removeDuty",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "removeInsurancePolicy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "removeRegistrationDate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_VIN",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "removeVehiclePassport",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "callerConfirmation",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
