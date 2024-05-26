export const VIN_REGEXP = /[A-HJ-NPR-Z0-9]{17}/i

export const DUTIES_DESCRIPTION = {
  AUTO_LICENSE_PLATES: 'Выдача номерных знаков на автомобиль',
  MOTORCYCLE_LICENSE_PLATES: 'Выдача номерных знаков на мотоцикл',
  VEHICLE_REGISTRATION_CERTIFICATE: 'СТС',
  CHANGE_PASSPORT_VEHICLE: 'Внесение изменений в ПТС',
  ISSUANCE_VEHICLE_PASSPORT: 'Выдача нового ПТС',
}

export const EDITOR_ROLE = 'EDITOR'

export const MODE = {
  ADD: "ADD",
  EDIT: "EDIT",
  REMOVE: "REMOVE"
}

export const ALERT_TYPE = {
  CONFIRM_TRANSACTION: {
    type: 'info',
    text: 'Подтвердите транзакцию в расширении браузера'
  },
  NO_PERMISSION: {
    type: 'warning',
    text: 'У этого аккаунта нет прав, выберите другой',
  },
  ACCOUNT_PERMISSION_ERROR: {
    type: 'error',
    text: 'Не удалось получить аккаунт',
  }
}

export const BLOCKCHAIN_URL = 'http://127.0.0.1:8545'

export const CONTRACT_INFO_URL = "http://127.0.0.1:3000/contract"